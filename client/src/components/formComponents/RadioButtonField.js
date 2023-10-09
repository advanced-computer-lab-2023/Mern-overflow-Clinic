


export default DatePickerField = (props)=> {


    const renderRadioOptions = () => {
        // JSX code for rendering radio options based on radioOptions goes here
        return (
          <>
            {props.radioOptions.forEach((option)=>{
                <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
            })}
          </>
        );
      };

    return (  
    <Grid item xs={12} >
        <FormControl sx={{ mt: 2 }}>
            <FormLabel id={props.fieldLabel}>Gender</FormLabel>
            <RadioGroup
                row
                defaultValue={props.fieldDefaultValue}
                id={props.fieldId}
                name={props.fieldName}
            >
                {renderRadioOptions()}
            </RadioGroup>
        </FormControl>
        </Grid>
    );
  }
  