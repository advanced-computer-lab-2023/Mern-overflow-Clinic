import {
    Input,
    Container,
    Button,
    List,
    ListItem,
    Paper,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Typography,
    Tab,
  } from "@mui/material";
  
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import React, { useEffect, useState } from "react";
  import Table from "@mui/material/Table";
  import TableBody from "@mui/material/TableBody";
  import TableCell from "@mui/material/TableCell";
  import TableHead from "@mui/material/TableHead";
  import TableRow from "@mui/material/TableRow";
  import axios from "axios";
  import styled from "styled-components";
  import { set } from "react-hook-form";
  import { useUser } from '../../userContest';

  export default function PatientViewPackages() {
    const [data, setData] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState({});
    const [selectedPatient, setSelectedPatient] = useState({});
    const [selectedFamilyMember, setSelectedFamilyMember] = useState({});
    const [selectedFamPackage, setSelectedFamPackage] = useState({});
    const [selectedFamArr, setSelectedFamArr] = useState([]);
    const [selectedFamPacArr, setSelectedFamPacArr] = useState([]);
    const [selectedFamRelArr, setSelectedFamRelArr] = useState({});
  
    const { userId } = useUser();
    let id = userId;

    const handleCancellingFamily = (familyMemberId) => {
      axios
        .delete(`http://localhost:8000/patients/${id}/packages/${familyMemberId}`, {
          params: { id: id, pId: familyMemberId },
        })
        .then((res) => {
          console.log(res.data);
          fetchTableData();
          window.location.reload();
        });
    }
  
    const fetchTableData = async () => {

      await axios
        .get(`http://localhost:8000/patients/${id}/packages`, {
           params: { id: id },
        })
        .then( async (res) => {
          setData(res.data);
          const [patientC, ...familyMembers] = res.data;
          setData(familyMembers);

            if (patientC) {

              const {"patientId": PatientId, "packageId": PackageId, "relation": self} = patientC;
              await axios
                .get(`http://localhost:8000/patients/${PatientId}`, {
                  params: { id: PatientId },
                })
                .then((res) => {
                  setSelectedPatient(res.data);
                });
              await axios
                .get(`http://localhost:8000/packages/${PackageId}`, {
                  params: { id: PackageId },
                })
                .then((res) => {
                  setSelectedPackage(res.data);
                });

            }

            let familyMembersData = [];
            let familyMembersPackageData = [];
            let familyMembersRelationData = [];
            if (familyMembers) {
              for(const familyMember of familyMembers) {

                const { "patientId": PatientId, "packageId": PackageId, "relation": Relation } = familyMember;
                await axios
                  .get(`http://localhost:8000/patients/${PatientId}`, {
                    params: { id: PatientId },
                  })
                  .then((res) => {
                    familyMembersData.push(res.data);
                  });
                await axios
                  .get(`http://localhost:8000/packages/${PackageId}`, {
                    params: { id: PackageId },
                  })
                  .then((res) => {
                    familyMembersPackageData.push(res.data);
                  });
                familyMembersRelationData.push(Relation);
              }
              setSelectedFamArr(familyMembersData);
              setSelectedFamPacArr(familyMembersPackageData);
              setSelectedFamRelArr(familyMembersRelationData);
            }

        }).catch((err) => {
          console.log(err);
        });
    };

    useEffect(() => {
      fetchTableData();
    }, []);

    return(
        <Container maxWidth="xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell key="Fname">Name</TableCell>
                {/* <TableCell key="Frelation">Relation</TableCell> */}
                <TableCell key="Fpname">Package Name</TableCell>
                <TableCell key="Fprice">Price</TableCell>
                <TableCell key="FdiscountOnDoctorSessions">Discount On Doctor Sessions</TableCell>
                <TableCell key="FdiscountOnMedicine">Discount On Medicine</TableCell>
                <TableCell key="FdiscountForFamily">Discount For Family</TableCell>
                <TableCell key="Fstatus">Status</TableCell>
                <TableCell key="FrenewalDate">Renewal Date</TableCell>
                <TableCell key="Faction">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { selectedFamArr &&
                selectedFamArr.map((row, index) => (
                  <TableRow key={row.name + row.nationalId + row.age + row.gender}>
                    <TableCell>{row.name}</TableCell>
                    {/* <TableCell>{selectedFamRelArr[index]}</TableCell> */}
                    <TableCell>{selectedFamPacArr[index].name}</TableCell>
                    <TableCell>{selectedFamPacArr[index].price}</TableCell>
                    <TableCell>{selectedFamPacArr[index].discountOnDoctorSessions}</TableCell>
                    <TableCell>{selectedFamPacArr[index].discountOnMedicine}</TableCell>
                    <TableCell>{selectedFamPacArr[index].discountForFamily}</TableCell>
                    {row && row.package &&
                      row.subscribedToPackage === true &&
                      new Date(row.packageRenewalDate).getTime() > Date.now() ? (
                        <>
                        <TableCell>Subscribed</TableCell>
                        </>
                      ) : (row && row.package &&
                            row.subscribedToPackage === false &&
                            new Date(row.packageRenewalDate).getTime() > Date.now() ? (
                              <>
                              <TableCell>Cancelled With End Date</TableCell>
                              </>
                            ) : (row && (row.package &&
                                  new Date(row.packageRenewalDate).getTime() <= Date.now())
                                  || !row.package ? (
                                    <>
                                    <TableCell>Unsubscribed</TableCell>
                                    </>
                                  ) : null))
                    }
                    <TableCell>{new Date(row.packageRenewalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                    {row && row.package &&
                      row.subscribedToPackage === true &&
                      new Date(row.packageRenewalDate).getTime() > Date.now() ? (
                        <>
                        <TableCell>
                          <Button onClick={() => handleCancellingFamily(row._id)}>
                            Cancel
                          </Button>
                        </TableCell>
                        </>
                      ) :null }
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Container>
    )
        
  }