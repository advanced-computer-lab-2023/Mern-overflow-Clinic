
import React from 'react';

import { useForm, Controller, SubmitHandler } from "react-hook-form"

export default FormConrainer = ()=> {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();

    const onSubmit = data => {
        console.log("Data to server" + JSON.stringify(data));
    }

    const handleChange = (event) => {
        if (errors[event.target.name]) {
            setError(event.target.name,
                {
                    type: errors[event.target.name]["type"],
                    message: errors[event.target.name]["type"]
                })
        }
    }

    const renderChildrenWithProps = () => {
        return React.Children.map(props.children, child => {
          // Clone the child element and add props to it
          return React.cloneElement(child, { errors, handleChange, register });
        });
      };

  return (  
    <Container component="main" maxWidth="md">
        <Box
            sx={{
                my: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#FFF',
                borderRadius: 5,
                padding: 3,
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4 }}> {props.formTitle} </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderChildrenWithProps()}

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}>
                    Submit
                </Button>
            </form>
        </Box>
    </Container >
  );
}

