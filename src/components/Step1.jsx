import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useCallback } from "react";
import "./step1.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const Step1 = () => {
  const useYupValidationResolver = (validationSchema) =>
    useCallback(
      async (data) => {
        try {
          const values = await validationSchema.validate(data, {
            abortEarly: false,
          });
          return {
            values,
            errors: {},
          };
        } catch (errors) {
          return {
            values: {},
            errors: errors.inner.reduce((allErrors, currentError) => {
              return {
                ...allErrors,
                [currentError.path]: {
                  type: currentError.type ?? "validation",
                  message: currentError.message,
                },
              };
            }, {}),
          };
        }
      },
      [validationSchema]
    );

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(4, "Name must be greater than 3 characters")
      .required("Name is required"),
    dob: yup
      .mixed()
      .test(
        "is-positive-number-or-date",
        "Please enter a valid date or age",
        function (value) {
          // Check if it's a positive number
          if (yup.number().isValidSync(value) && value > 0) {
            return true;
          }
          // Check if it's a valid date in DD/MM/YYYY format
          if (
            yup
              .string()
              .matches(
                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                "Invalid date format"
              )
              .isValidSync(value)
          ) {
            return true;
          }
          return false;
        }
      )
      .required("Please enter a value for Age"),
    gender: yup
      .string()
      .test(
        "gender-validator",
        "Gender should either Male, Female or Other",
        function (value) {
          return ["male", "female", "other"].includes(value);
        }
      )
      .required("Gender is required"),
    // Valid Indian Mobile Number type text field phoneNumber
    phoneNumber: yup
      .string()
      .matches(/^[6789]\d{9}$/, "Enter a valid mobile number")
      .length(10, "Mobile number must be of length 10"),
    gidType: yup
      .string()
      .test(
        "gidType-validator",
        "Govt ID Type should be either Aadhar or PAN",
        function (value) {
          return ["aadhar", "pan"].includes(value);
        }
      )
      .required("Please select ID type."),
    gidText: yup.string().when("gidType", {
      is: (val) => val === "aadhar",
      then: () =>
        yup
          .string()
          .matches(/^[23456789]\d{11}$/, "Enter a valid aadhar number")
          .min(12, "Aadhar number should be 12 digits")
          .max(12, "Aadhar number should be 12 digits")
          .required("Please enter your Aadhar number"),
      otherwise: () =>
        yup.string().trim().matches(
            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            "PAN number should be in the format XXXXX0000X"
          ).required("Please enter your PAN number"),
    }),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver });

  function onSubmit(values) {
    console.log(values);
  }

  return (
    <>
      <h1>Step 1</h1>
      <hr />
      <h3>Personal Details</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container
          sx={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            paddingBottom: "10px",
          }}
        >
          <div className="input-group">
            <label htmlFor="name">
              Name<span>*</span>
            </label>
            <TextField
              id="outlined-basic"
              label="Enter Name"
              variant="outlined"
              //   name="name"
              //   onChange={handleInputChange}
              {...register("name")}
              error={errors?.name}
              helperText={errors?.name?.message}
            />
          </div>

          <div className="input-group">
            <label htmlFor="dob">
              Date of Birth or Age
              <span>*</span>
            </label>
            <TextField
              id="outlined-basic"
              label="DD/MM/YYYY or Age in Years"
              variant="outlined"
              sx={{ width: "20rem" }}
              {...register("dob")}
              error={errors?.dob}
              helperText={errors?.dob?.message}
            />
          </div>

          <div className="input-group">
            <label htmlFor="gender">
              Sex<span>*</span>
            </label>
            <FormControl error={errors?.gender} sx={{ width: "10rem" }}>
              <InputLabel id="demo-simple-select-label">Enter Sex</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Enter Sex"
                {...register("gender")}
                error={errors?.gender}
                helperText={errors?.gender?.message}
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
                <MenuItem value={"other"}>Other</MenuItem>
              </Select>
              {errors?.gender && (
                <FormHelperText error>{errors.gender.message}</FormHelperText>
              )}
            </FormControl>
          </div>

          <div className="input-group">
            <label htmlFor="mobile">Mobile</label>
            <TextField
              id="outlined-basic"
              label="Enter Mobile"
              variant="outlined"
              {...register("phoneNumber")}
              error={errors?.phoneNumber}
              helperText={errors?.phoneNumber?.message}
            />
          </div>

          <div className="input-group">
            <label htmlFor="gid">
              Govt Issued ID
              <span>*</span>
            </label>
            <FormControl sx={{ width: "10rem" }} error={errors?.gidType}>
              <InputLabel id="gid">ID Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="ID Type"
                {...register("gidType")}
              >
                <MenuItem value={"aadhar"}>Aadhar</MenuItem>
                <MenuItem value={"pan"}>PAN</MenuItem>
              </Select>
              {errors?.gidType && (
                <FormHelperText error>
                  {errors?.gidType?.message}
                </FormHelperText>
              )}
            </FormControl>
            <TextField
              id="gid"
              label="Enter Govt ID"
              variant="outlined"
              sx={{ width: "20rem" }}
              {...register("gidText")}
              error={errors?.gidText}
              helperText={errors?.gidText?.message}
            />
          </div>
        </Container>
        <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained">
            Next
          </Button>
        </Container>
      </form>
      <hr />
    </>
  );
};

export default Step1;
