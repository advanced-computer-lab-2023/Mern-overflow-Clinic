
import React from 'react';
import { TextField, Grid} from '@mui/material';
// import FormControl from '@mui/material/FormControl';


export default InputField = (props)=> {

  return (  
    <Grid item xs={12} sm={12} md={12}>
        <TextField
            id={props.fieldId}
            type={props.inputDataType}
            label={props.fieldLabel}
            {...props.register(props.fieldLabel, props.validation)}
            error={!!props.errors[props.fieldLabel]}
            helperText={props.errors[props.fieldLabel]?.message}
            onBlur={props.handleChange}
        />
    </Grid>
  );
}




