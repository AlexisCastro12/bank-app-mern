import React from "react";
import { useFormik } from "formik";
import auth from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import swal from 'sweetalert2';
import axios from 'axios'

const Login = () => {
  const modal = swal.mixin({
    showConfirmButton: true,
    timer: 4000,
    timerProgressBar: true,
    didDestroy: () => {
      window.location.href = `${window.location.hostname}/Home`
    }
  })

  const errorModalHandle = () => {
    swal.fire({
      icon: 'error',
      titleText: 'Error',
      text: `An error has occurred with the credentials. If you have logged in at least once with your google account try using that provider again.`,
      footer: '<p>Please try again or sign up <a href="/createaccount"> here</a></p>'
    })
  }
  const loginGoogle = () => {
    console.log("google sign in clicked");
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const userAuth = result.user;
        console.log(userAuth);
        //check if the user exists and create a new entry if is neccessary
        axios.post(`${process.env.REACT_APP_API_URL}/account/loginGoogle`, {
          name: userAuth.displayName,
          email: userAuth.email
        });
        modal.fire({
          icon: 'success',
          titleText: 'Success',
          text: 'you have successfully logged in',
          footer: `<p>you are logged in as <b>${userAuth.email}</b></p>`
        })
      })
      .catch(function (error) {
        console.log(error);
        errorModalHandle();
      });
  };

  const formik = useFormik({
    initialValues: {
      emailField: "",
      pswField: "",
    },
    onSubmit: (values) => {
      //LOGIN WITH FIREBASE
      let email = values.emailField.trim();
      let password = values.pswField;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          modal.fire({
            icon: 'success',
            titleText: 'Success',
            text: 'you have successfully logged in',
            footer: `<p>you are logged in as <b>${userCredential.user.email}</b></p>`
          })
        })
        .catch(function (error) {
          console.log(error);
          errorModalHandle();
        });
    },
    validate: (values) => {
      let errors = {};
      let RegExpEmail =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; //We use the RFC 5322 compliant regex to validate the email
      //--------------------
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
      document.getElementById("emailField").value != "" &&
      document.getElementById("pswField").value != ""
    ) {
      document.getElementById("btn-Login").disabled = false;
      return null;
    }
    document.getElementById("btn-Login").disabled = true;
  }

  return (
    <>
      <div className="container w-75 my-3 rounded shadow bg-info bg-opacity-50">
        <div className="row align-items-stretch">
          <div
            className="col d-none d-md-block col-sm-4 col-md-5 rounded"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,50)), url(./LoginForm.png)",
              backgroundSize: "100% 100%",
            }}
          ></div>
          <div className="col bg-white rounded-end">
              <h2 className="font-weight-bolder text-center display-4 pt-5 pb-2">
                Users
              </h2>
              <h4 className="text-center pb-5">Log in</h4>
              <form onSubmit={formik.handleSubmit} onChange={enableSubmit}>
                <div className="mb-4">
                  <label className="form-label">Email:</label>
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
                      <div style={{ color: "red" }}>
                        {formik.errors.emailField}
                      </div>
                    ) : formik.errors.emailFieldFormat ? (
                      <div style={{ color: "red" }}>
                        {formik.errors.emailFieldFormat}
                      </div>
                    ) : null
                  }
                </div>
                <div className="mb-4">
                  <label className="form-label">Password:</label>
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
                      <div style={{ color: "red" }}>
                        {formik.errors.pswField}
                      </div>
                    ) : formik.errors.pswLength ? (
                      <div style={{ color: "red" }}>
                        {formik.errors.pswLength}
                      </div>
                    ) : null
                  }
                </div>
                <div>
                  <button
                    className="form-control btn btn-primary"
                    type="submit"
                    id="btn-Login"
                    disabled={true}
                  >
                    LOG IN
                  </button>
                </div>
              </form>
              <div className="my-3 text-center">OR</div>
              <div className="mb-5">
                <button
                  className="form-control btn btn-outline-secondary"
                  id="btn-LoginGoogle"
                  onClick={loginGoogle}
                >
                  <img src="./iconGoogle.png" alt="" width="24" height="24" />{" "}
                  LOG IN WITH GOOGLE
                </button>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Login;
