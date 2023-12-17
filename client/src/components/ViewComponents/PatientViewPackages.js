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
  import { styled } from '@mui/material/styles';
  import { set } from "react-hook-form";
  import { useUser } from '../../userContest';
  import { tableCellClasses } from "@mui/material";

  export default function PatientViewPackages() {
    const [data, setData] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState({});
    const [selectedPatient, setSelectedPatient] = useState({});
    const [selectedFamilyMember, setSelectedFamilyMember] = useState({});
    const [selectedFamPackage, setSelectedFamPackage] = useState({});
    const [selectedFamArr, setSelectedFamArr] = useState([]);
    const [selectedFamPacArr, setSelectedFamPacArr] = useState([]);
    const [selectedFamRelArr, setSelectedFamRelArr] = useState({});
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    const { userId } = useUser();

    let id = userId;

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  
    const handleSuccessClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setSuccessOpen(false);
    };
    const handleErrorClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setErrorOpen(false);
    };

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
              <StyledTableRow>
                <StyledTableCell key="Fname">Name</StyledTableCell>
                <StyledTableCell key="Frelation">Relation</StyledTableCell>
                <StyledTableCell key="Fpname">Package Name</StyledTableCell>
                <StyledTableCell key="Fprice">Price</StyledTableCell>
                <StyledTableCell key="FdiscountOnDoctorSessions">Discount On Doctor Sessions</StyledTableCell>
                <StyledTableCell key="FdiscountOnMedicine">Discount On Medicine</StyledTableCell>
                <StyledTableCell key="FdiscountForFamily">Discount For Family</StyledTableCell>
                <StyledTableCell key="Fstatus">Status</StyledTableCell>
                <StyledTableCell key="FrenewalDate">Renewal Date</StyledTableCell>
                <StyledTableCell key="Faction">Action</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              { selectedFamArr &&
                selectedFamArr.map((row, index) => (
                  <StyledTableRow key={row.name + row.nationalId + row.age + row.gender}>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    <StyledTableCell>{selectedFamRelArr[index]}</StyledTableCell>
                    <StyledTableCell>{selectedFamPacArr[index].name}</StyledTableCell>
                    <StyledTableCell>{selectedFamPacArr[index].price}</StyledTableCell>
                    <StyledTableCell>{selectedFamPacArr[index].discountOnDoctorSessions}</StyledTableCell>
                    <StyledTableCell>{selectedFamPacArr[index].discountOnMedicine}</StyledTableCell>
                    <StyledTableCell>{selectedFamPacArr[index].discountForFamily}</StyledTableCell>
                    {row && row.package &&
                      row.subscribedToPackage === true &&
                      new Date(row.packageRenewalDate).getTime() > Date.now() ? (
                        <>
                        <StyledTableCell>Subscribed</StyledTableCell>
                        </>
                      ) : (row && row.package &&
                            row.subscribedToPackage === false &&
                            new Date(row.packageRenewalDate).getTime() > Date.now() ? (
                              <>
                              <StyledTableCell>Cancelled With End Date</StyledTableCell>
                              </>
                            ) : (row && (row.package &&
                                  new Date(row.packageRenewalDate).getTime() <= Date.now())
                                  || !row.package ? (
                                    <>
                                    <StyledTableCell>Unsubscribed</StyledTableCell>
                                    </>
                                  ) : null))
                    }
                    <StyledTableCell>{new Date(row.packageRenewalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</StyledTableCell>
                    {row && row.package &&
                      row.subscribedToPackage === true &&
                      new Date(row.packageRenewalDate).getTime() > Date.now() ? (
                        <>
                        <StyledTableCell>
                          <Button error onClick={() => handleCancellingFamily(row._id)}>
                            Cancel
                          </Button>
                        </StyledTableCell>
                        </>
                      ) :
                      <>
                        <StyledTableCell>
                          <Button disabled>
                            Cancel
                          </Button>
                        </StyledTableCell>
                        </>
                      }
                  </StyledTableRow>
                ))
              }
            </TableBody>
          </Table>
        </Container>
    )
        
  }