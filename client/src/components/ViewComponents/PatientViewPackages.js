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
    // const id = "655089b786a7e9fff5d1d36a";
    // const packageId = "65508f6474b689a4652ca2de";

    const handleCancelling = () => {
      axios
        .delete(`http://localhost:8000/patients/${id}/packages`, {
          params: { id: id },
        })
        .then((res) => {
          console.log(res.data);
          fetchTableData();
          window.location.reload();
        });
    }

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
          // console.log("res.dataa = "+res.data);
          // console.log("data = "+data);
          const [patientC, ...familyMembers] = res.data;
          setData(familyMembers);
          // console.log("patientC = "+JSON.stringify(patientC));
          // console.log("familyMembers = "+JSON.stringify(familyMembers));
          // console.log("patientC = "+patientC);

            if (patientC) {

              const {"patientId": PatientId, "packageId": PackageId, "relation": self} = patientC;
              // console.log("patientId = "+patientId + " packageId = "+packageId);
              await axios
                .get(`http://localhost:8000/patients/${PatientId}`, {
                  params: { id: PatientId },
                })
                .then((res) => {
                  setSelectedPatient(res.data);
                  // console.log("selectedPatient = "+JSON.stringify(res.data));
                  // console.log(res.data);
                  // console.log(res.data.package);
                  // console.log(res.data.subscribedToPackage === true);
                  // console.log(new Date(res.data.packageRenewalDate).getTime() > Date.now());
                  // console.log("renewal date = "+new Date(res.data.packageRenewalDate).getTime());
                  // console.log("current date = "+Date.now());
                });
              await axios
                .get(`http://localhost:8000/packages/${PackageId}`, {
                  params: { id: PackageId },
                })
                .then((res) => {
                  setSelectedPackage(res.data);
                  // console.log("selected package is " + res.data.name);
                });

            }

            let familyMembersData = [];
            let familyMembersPackageData = [];
            let familyMembersRelationData = [];
            if (familyMembers) {
              for(const familyMember of familyMembers) {
                // console.log("patientId = "+patientId + " packageId = "+packageId);

                const { "patientId": PatientId, "packageId": PackageId, "relation": Relation } = familyMember;
                await axios
                  .get(`http://localhost:8000/patients/${PatientId}`, {
                    params: { id: PatientId },
                  })
                  .then((res) => {
                    familyMembersData.push(res.data);
                    // console.log("selectedFamilyMember = "+JSON.stringify(res.data));
                  });
                await axios
                  .get(`http://localhost:8000/packages/${PackageId}`, {
                    params: { id: PackageId },
                  })
                  .then((res) => {
                    // console.log("Package res.data = "+JSON.stringify(res.data));
                    familyMembersPackageData.push(res.data);
                    // setSelectedFamPacArr([...selectedFamPacArr, res.data]);
                    // console.log("familyMembersPackageData HII = "+JSON.stringify(familyMembersPackageData));
                    // console.log("selected package is " + res.data.name);
                  });
                familyMembersRelationData.push(Relation);
                // console.log("familyMembers LOWW = "+JSON.stringify(familyMembersData));
                // console.log("familyMembersPackageData LOWW = "+JSON.stringify(familyMembersPackageData));
              }
              // console.log("familyMembersDataArr = "+familyMembersDataArr);
              // console.log("familyMembersData = "+familyMembersData);
              // console.log("familyMembersPackageData = "+familyMembersPackageData);
              // console.log("familyMembersRelationData = "+familyMembersRelationData);
              // console.log("selectedFamPackkkArrBef = "+JSON.stringify(familyMembersPackageData));
              // console.log("selectedFamArrBef = "+JSON.stringify(familyMembersData));
              setSelectedFamArr(familyMembersData);
              setSelectedFamPacArr(familyMembersPackageData);
              setSelectedFamRelArr(familyMembersRelationData);
              // console.log("selectedFamPackkkArr = "+JSON.stringify(familyMembersPackageData));
              // console.log("selectedFamArr = "+JSON.stringify(familyMembersData));
            }

        }).catch((err) => {
          console.log(err);
        });
    };

    useEffect(() => {
      fetchTableData();
      // getPackagesData();
    }, []);


    const LineStrip = styled.div`
      position: relative;
      width: 100%;
      height: 10px;
      background-color: black;
    `;

    const WordLabel = styled.div`
      position: absolute;
      top: 0;
      left: 0;
      padding: 5px;
      background-color: white;
      color: black;
      font-size: 14px;
    `;

    function LineStripWithWords({ text }) {
      const words = text.split(" ");

      return (
        <LineStrip>
          <WordLabel>{words[0]}</WordLabel>
          <div style={{ width: `${100 - 5 * words.length}%` }} />
          <WordLabel>{words[words.length - 1]}</WordLabel>
        </LineStrip>
      );
    }

    return(
        <Container maxWidth="xl">
          < LineStripWithWords text="Your Package Information" />
          <Table>
              <TableHead>
              <TableRow>
                  <TableCell  key="Pname">Name</TableCell>
                  <TableCell key="Ppname">Package Name</TableCell>
                  <TableCell key="Pprice">Price</TableCell>
                  <TableCell key="PdiscountOnDoctorSessions">Discount On Doctor Sessions</TableCell>
                  <TableCell key="PdiscountOnMedicine">Discount On Medicine</TableCell>
                  <TableCell key="PdiscountForFamily">Discount For Family</TableCell>
                  <TableCell key="Pstatus">Status</TableCell>
                  <TableCell key="PrenewalDate">Renewal Date</TableCell>
                  <TableCell key="Paction">Action</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
                {selectedPackage && 
                <TableRow key={selectedPackage.name + selectedPackage.price}>
                  <TableCell>{selectedPatient.name}</TableCell>
                  <TableCell>{selectedPackage.name}</TableCell>
                  <TableCell>{selectedPackage.price}</TableCell>
                  <TableCell>{selectedPackage.discountOnDoctorSessions}</TableCell>
                  <TableCell>{selectedPackage.discountOnMedicine}</TableCell>
                  <TableCell>{selectedPackage.discountForFamily}</TableCell>
                  {selectedPatient && selectedPatient.package && 
                    selectedPatient.subscribedToPackage === true && 
                    new Date(selectedPatient.packageRenewalDate).getTime() > Date.now() ? (
                      <>
                      <TableCell>Subscribed</TableCell>
                      </>
                    ) : (selectedPatient && selectedPatient.package && 
                          selectedPatient.subscribedToPackage === false && 
                          new Date(selectedPatient.packageRenewalDate).getTime() > Date.now() ? (
                            <>
                            <TableCell>Cancelled With End Date</TableCell>
                            </>
                          ) : (selectedPatient && (selectedPatient.package && 
                                new Date(selectedPatient.packageRenewalDate).getTime() <= Date.now())
                                || !selectedPatient.package ? (
                                  <>
                                  <TableCell>Unsubscribed</TableCell>
                                  </>
                                ) : null))
                  }
                  <TableCell>{new Date(selectedPatient.packageRenewalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                  {selectedPatient && selectedPatient.package && 
                    selectedPatient.subscribedToPackage === true && 
                    new Date(selectedPatient.packageRenewalDate).getTime() > Date.now() ? (
                      <>
                      <TableCell>
                        <Button onClick={() => handleCancelling()}>
                          Cancel
                        </Button>
                      </TableCell>
                      </>
                    ) :null }
                </TableRow>
                }
              </TableBody>
          </Table>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell key="Fname">Name</TableCell>
                {/* <TableCell key="FnationalId">National ID</TableCell> */}
                <TableCell key="Frelation">Relation</TableCell>
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
              {/* {console.log("data = "+JSON.stringify(data))}
              {console.log("selectedFamArrREACT = "+JSON.stringify(selectedFamArr))} */}
              { selectedFamArr &&
                selectedFamArr.map((row, index) => (
                  <TableRow key={row.name + row.nationalId + row.age + row.gender}>
                    <TableCell>{row.name}</TableCell>
                    {/* <TableCell>{row.nationalId}</TableCell> */}
                    <TableCell>{selectedFamRelArr[index]}</TableCell>
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