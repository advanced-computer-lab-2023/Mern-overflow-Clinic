import { DatePicker } from "@mui/x-date-pickers";
import {Grid} from '@mui/material';
// import FormControl from '@mui/material/FormControl';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default DatePickerField = (props)=> {

    return (  
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker
                        disableFuture
                        sx={{ minWidth: "200px", width: "225px" }}
                        label={props.fieldLabel}
                        style={{ marginLeft: 'auto', marginRight: 'auto' }}
                    />
                </DemoContainer>
            </LocalizationProvider>
        </Grid>
    );
  }
  
  
  
  
  