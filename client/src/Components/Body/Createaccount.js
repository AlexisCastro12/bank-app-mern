import React from "react";
import Card from "../Card";
import { useFormik } from "formik";
import auth from "../firebaseConfig";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import axios from "axios";
import { Link } from "react-router-dom";

const Createaccount = () => {
  const [show, setShow] = React.useState(true); //to switch Create Account Form & Registration successful

  const formik = useFormik({
    initialValues: {
      nameField: "",
      emailField: "",
      pswField: "",
    },
    onSubmit: (values) => {
      const name = values.nameField.trim();
      const email = values.emailField.trim();
      const password = values.pswField;

      
      createUserWithEmailAndPassword(auth, email, password)
        .then((userAuth) => {
          //Create a new entry in database
          //We signOut to allow add more accounts and avoid problems
          signOut(auth);
          setShow(false);
          values.nameField = "";
          values.emailField = "";
          values.pswField = "";
          return axios.post(`${process.env.REACT_APP_API_URL}/account/create`, {
            name: name,
            email: email
          });
        })
        .catch(function (error) {
          console.log(error);
          alert(error.message);
        });
    },
    validate: (values) => {
      let errors = {};
      let RegExpEmail =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; //We use the RFC 5322 compliant regex to validate the email
      let RegExpName = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/;
      if (!values.nameField) errors.nameField = "Required Field"; //Create the error to name field (empty field)
      if (!RegExpName.test(values.nameField))
        errors.nameFieldFormat =
          "The input must not contain numbers or special characters"; //Create the error to name field (format field)
      if (!values.emailField) errors.emailField = "Required Field"; //Create the error to email field (empty field)
      if (!RegExpEmail.test(values.emailField))
        errors.emailFieldFormat = "The input must be email format"; //Create the error to email field (format field)
      if (!values.pswField) errors.pswField = "Required Field"; //Create the error to psw field (empty field)
      if (values.pswField.length < 8)
        errors.pswLength = "length must be at least 8 characters"; //Create the error to password length
      return errors;
    },
  });

  function enableSubmit() {
    if (
      document.getElementById("nameField").value != "" &&
      document.getElementById("emailField").value != "" &&
      document.getElementById("pswField").value != ""
    ) {
      document.getElementById("btn-CreateAccount").disabled = false; //
      return null;
    }
    document.getElementById("btn-CreateAccount").disabled = true; //
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      {show ? (
        <Card
          bgcolor="info bg-opacity-25 "
          header="CREATE ACCOUNT"
          txtcolor="dark"
          body={
            <form onSubmit={formik.handleSubmit} onChange={enableSubmit}>
              <label className="control-label mb-2">Name:</label>
              <input
                type="text"
                className="form-control"
                id="nameField"
                onChange={formik.handleChange}
                value={formik.values.nameField}
                placeholder="Enter name"
              />
              {
                /*Incrust the error message if the errors ocurrs*/
                formik.errors.nameField ? (
                  <div style={{ color: "red" }}>{formik.errors.nameField}</div>
                ) : formik.errors.nameFieldFormat ? (
                  <div style={{ color: "red" }}>
                    {formik.errors.nameFieldFormat}
                  </div>
                ) : null
              }
              <br />
              <label className="control-label mb-2">Email:</label>
              <input
                type="text"
                className="form-control"
                id="emailField"
                onChange={formik.handleChange}
                value={formik.values.emailField}
                placeholder="Enter email"
              />
              {
                /*Incrust the error message if the errors ocurrs*/
                formik.errors.emailField ? (
                  <div style={{ color: "red" }}>{formik.errors.emailField}</div>
                ) : formik.errors.emailFieldFormat ? (
                  <div style={{ color: "red" }}>
                    {formik.errors.emailFieldFormat}
                  </div>
                ) : null
              }
              <br />
              <label className="control-label mb-2">Password:</label>
              <input
                type="password"
                className="form-control"
                id="pswField"
                onChange={formik.handleChange}
                value={formik.values.pswField}
                placeholder="Enter password"
              />
              {
                /*Incrust the error message if the errors ocurrs*/
                formik.errors.pswField ? (
                  <div style={{ color: "red" }}>{formik.errors.pswField}</div>
                ) : formik.errors.pswLength ? (
                  <div style={{ color: "red" }}>{formik.errors.pswLength}</div>
                ) : null
              }
              <br />
              <div className="text-center">
                <button
                  id="btn-CreateAccount"
                  type="submit"
                  style={{ width: "100%" }}
                  className="btn btn-primary"
                  disabled={true}
                >
                  Create Account
                </button>
              </div>
            </form>
          }
        />
      ) : (
        <Card
          bgcolor="success bg-opacity-50 "
          header="CREATE ACCOUNT"
          txtcolor="dark"
          body={
            <>
              <h4 className="text-center display-6 m-5">
                Registration Successful.
              </h4>
              <button
                style={{ width: "100%" }}
                className="btn btn-success"
                onClick={() => setShow(true)}
              >
                Add another account
              </button>
              <Link to="/login">
              <button
                style={{ width: "100%" }}
                className="btn btn-light mt-2"
              >
                Login into account
              </button>
              </Link>
            </>
            
          }
        />
      )}
    </div>
  );
};

export default Createaccount;
