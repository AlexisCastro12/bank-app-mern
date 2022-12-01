import React from "react";
import Card from "../Card";
import { UserActive } from "../../App";
import Toast from "react-bootstrap/Toast";
import { useFormik } from "formik";
import axios from "axios";

const Withdraw = () => {
  const [show, setShow] = React.useState(false); //To toast
  const user = React.useContext(UserActive); //Context to display information of the active user in the UI
  const [amount, setAmount] = React.useState(user.balance + 1);

  const formik = useFormik({
    initialValues: {
      withdrawField: "",
    },
    onSubmit: (values) => {
      if (Number(values.withdrawField) <= Number(user.balance)) {
        setAmount(Number(values.withdrawField));
        user.balance -= Number(values.withdrawField);
        if (Number(values.withdrawField) != 0) {  //Not write movements with amounts equals to 0
          axios
            .post("/account/update", {
              balance: user.balance,
              email: user.email,
              tracking: {
                operationid: 0,
                amount: Number(values.withdrawField),
                balance: user.balance,
              },
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      } else {
        setAmount(user.balance + 1); //set the amount for avoid garbage in toast
      }
      setShow(true);
    },
    validate: (values) => {
      let errors = {};
      let RegExpPosNegNumbers = /^-?\d*(\.\d+)?$/;
      //--------------------
      if (!RegExpPosNegNumbers.test(values.withdrawField))
        errors.withdrawFieldFormat = "The input must be number format"; //Create the error to number field (format field)
      if (values.withdrawField == "-")
        errors.withdrawFieldFormat = "The input must be number format"; //Create the error to number field (format field)
      if (Number(values.withdrawField) < 0)
        errors.withdrawFieldNegative = "The input must be a positive number";
      return errors;
    },
  });

  function enableSubmit() {
    if (document.getElementById("withdrawField").value != "") {
      document.getElementById("btn-Withdraw").disabled = false;
      return null;
    }
    document.getElementById("btn-Withdraw").disabled = true;
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <Card
          bgcolor="danger bg-opacity-25 "
          header="WITHDRAW"
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
                <label className="control-label mb-2">Withdraw Amount:</label>
                <input
                  type="text"
                  className="form-control"
                  id="withdrawField"
                  onChange={formik.handleChange}
                  value={formik.values.withdrawField}
                  placeholder="Enter withdraw amount"
                />
                {
                  /*Incrust the error message if the errors ocurrs*/
                  formik.errors.withdrawFieldFormat ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.withdrawFieldFormat}
                    </div>
                  ) : formik.errors.withdrawFieldNegative ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.withdrawFieldNegative}
                    </div>
                  ) : null
                }
                <br />
                <div className="text-center">
                  <button
                    style={{ width: "100%" }}
                    className="btn btn-secondary"
                    type="submit"
                    id="btn-Withdraw"
                    disabled={true}
                  >
                    Withdraw
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
        {amount <= Number(user.balance) || Number(user.balance) - amount == -amount ? (
          <Toast
            className="bg-success bg-opacity-25"
            onClose={() => setShow(false)}
            show={show}
            delay={3500}
            autohide
          >
            <Toast.Header className="text-dark">
              <img src="./cashToast.png" className="rounded me-2" alt="" />
              <h6 className="me-auto">Withdraw Successful</h6>
            </Toast.Header>
            <Toast.Body>
              Hi! <b>{user.name}</b>, you've' Withdrawn <b>${amount}</b> from
              your account
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
              The maximum amount allowed to withdraw is <b>{user.balance}</b>
            </Toast.Body>
          </Toast>
        )}
      </div>
    </>
  );
};

export default Withdraw;
