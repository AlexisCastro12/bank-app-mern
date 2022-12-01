import React from "react";
import Card from "../Card";
import { UserActive } from "../../App";
import Toast from "react-bootstrap/Toast";
import { useFormik } from "formik";
import axios from "axios";
const Deposit = () => {
  const [show, setShow] = React.useState(false); //To toast
  const [amount,setAmount] = React.useState(5001);
  const user = React.useContext(UserActive); //Context to display information of the active user in the UI

  const formik = useFormik({
    initialValues: {
      depositField: "",
    },
    onSubmit: (values) => {
      if (Number(values.depositField) <= 5000) {
        setAmount(Number(values.depositField))  //To display the correct value in toast
        user.balance += Number(values.depositField)
      if (Number(values.depositField) != 0) {  //Not write movements with amounts equals to 0)
        axios.post(`${process.env.REACT_APP_API_URL}/account/update`, {
          balance: user.balance,
          email: user.email,
          tracking: {operationid: 1, amount: Number(values.depositField), balance: user.balance }
        })
        .catch(function (error) {
        console.log(error);
      })};
      }
      else{
        setAmount(5001) //set the amount for avoid garbage in toast
      }
      setShow(true);
    },
    validate: (values) => {
      let errors = {};
      let RegExpPosNegNumbers = /^-?\d*(\.\d+)?$/;
      //--------------------
      if(!RegExpPosNegNumbers.test(values.depositField) )
        errors.depositFieldFormat = "The input must be number format"; //Create the error to number field (format field)
      if(values.depositField == "-")
        errors.depositFieldFormat = "The input must be number format"; //Create the error to number field (format field)
      if(Number(values.depositField) < 0)
        errors.depositFieldNegative = "The input must be a positive number";
      return errors;
    },
  });

  function enableSubmit() {
    if (
      document.getElementById("depositField").value != ""
    ) {
      document.getElementById("btn-Deposit").disabled = false;
      return null;
    }
    document.getElementById("btn-Deposit").disabled = true;
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <Card
          bgcolor="warning bg-opacity-25 "
          header="DEPOSIT"
          txtcolor="dark"
          body={
            !user.name ? (
              <div style={{ color: "red" }}>
                You need to login to enable this operation
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit} onChange={enableSubmit}>
                <div>
                  <h4>Username: {user.name}</h4>
                  <h5>Balance: ${user.balance}</h5>
                </div>
                <label className="control-label mb-2">Deposit Amount:</label>
                <input
                  type="text"
                  className="form-control"
                  id="depositField"
                  onChange={formik.handleChange}
                  value={formik.values.depositField}
                  placeholder="Enter deposit amount"
                />
                {
                  /*Incrust the error message if the errors ocurrs*/
                  formik.errors.depositFieldFormat ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.depositFieldFormat}
                    </div>
                  ) : formik.errors.depositFieldNegative ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.depositFieldNegative}
                    </div>
                  ) : null
                }
                <br />
                <div className="text-center">
                  <button
                    style={{ width: "100%" }}
                    className="btn btn-secondary"
                    type="submit"
                    id="btn-Deposit"
                    disabled={true}
                  >
                    Deposit
                  </button>
                </div>
              </form>
            )
          }
        />
      </div>
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: "11" }}
      >
        {amount <= 5000 ? (
          <Toast
            className="bg-success bg-opacity-25"
            onClose={() => setShow(false)}
            show={show}
            delay={3500}
            autohide
          >
            <Toast.Header className="text-dark">
              <img src="./cashToast.png" className="rounded me-2" alt="" />
              <h6 className="me-auto">Deposit Successful</h6>
            </Toast.Header>
            <Toast.Body>
              Hi! <b>{user.name}</b>, you've deposited <b>$
              {amount}</b> to your account
            </Toast.Body>
          </Toast>
        ) : (
          <Toast
            className="bg-danger bg-opacity-25"
            onClose={() => setShow(false)}
            show={show}
            delay={3500}
            autohide
          >
            <Toast.Header className="text-dark">
              <img src="./cashToast.png" className="rounded me-2" alt="" />
              <h6 className="me-auto">Transaction Failed</h6>
            </Toast.Header>
            <Toast.Body>
              The maximum amount allowed to deposit is <b>$5000</b>
            </Toast.Body>
          </Toast>
        )}
      </div>
    </>
  );
};

export default Deposit;
