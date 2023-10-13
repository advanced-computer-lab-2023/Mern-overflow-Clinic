import React, { useEffect, useState } from "react";
import { Container, Button, Paper, FormControl, Select, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Input, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function AdminViewPackages(props) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [Query, setQuery] = useState("");
    const [uniqueMedicinalUses, setUniqueMedicinalUses] = useState(["All"]);

    const fetchTableData = () => {
        axios
            .get(`http://localhost:8000/packages`, {})
            .then((res) => {
                setData(res.data);
                props.setDataIsUpdated(true);
                let temp = ["All"];
                res.data.map((key) => {
                    if (temp.indexOf(key.medicinalUse) === -1) {
                        temp.push(key.medicinalUse);
                    }
                    return null;
                });
                setUniqueMedicinalUses(temp);
            })
    };

    useEffect(() => {
        fetchTableData();
    }, [props.dataIsUpdated]);


    const handleClickDelete = (id) => {

        axios.delete(`http://localhost:8000/packages/${id}`)
            .then((response) => {
                console.log('DELETE request successful', response);
                fetchTableData();
            })
            .catch((error) => {
                console.error('Error making DELETE request', error);
            });
    };


    const handleClickEdit = (id) => {
        navigate(`/admin/packages/${id}`);
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ p: "20px", my: "40px", paddingBottom: 5 }}>
                <Container>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell key="name" sx={{ fontWeight: "bold", borderTop: '1px solid #ccc' }}>Name</TableCell>
                                <TableCell key="price" sx={{ fontWeight: "bold", borderTop: '1px solid #ccc' }}>Price</TableCell>
                                <TableCell key="discountOnDoctorSessions" sx={{ fontWeight: "bold", borderTop: '1px solid #ccc' }}>Discount On Doctor Sessions</TableCell>
                                <TableCell key="discountOnMedicine" sx={{ fontWeight: "bold", borderTop: '1px solid #ccc', borderRight: '1px solid #ccc' }}>Discount on Medicine</TableCell>
                                <TableCell key="discountForFamily" sx={{ fontWeight: "bold", borderTop: '1px solid #ccc', borderRight: '1px solid #ccc' }}>Discount For Family</TableCell>
                                <TableCell colSpan={2} key="details" sx={{ textAlign: 'center', fontWeight: "bold", borderTop: '1px solid #ccc' }}>Actions</TableCell>
                                {/* <TableCell key="details" sx={{ textAlign: 'center', fontWeight: "bold" }}>Edit</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {data.map(
                                (row) =>
                                    row.name.toLowerCase().includes(Query.toLowerCase()) && (
                                        <TableRow key={row.username}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>EGP {row.price}</TableCell>
                                            <TableCell>{row.discountOnDoctorSessions}%</TableCell>
                                            <TableCell>{row.discountOnMedicine}%</TableCell>
                                            <TableCell>{row.discountForFamily}%</TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <IconButton onClick={() => handleClickEdit(row._id)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>

                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <IconButton onClick={() => handleClickDelete(row._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ),
                            )}
                        </TableBody>
                    </Table>

                </Container >
            </Paper>
        </Container >
    );
}
