import React from "react";
import { UserActive, UserMovements } from "../../App";
import axios from "axios";
import { move } from "formik";

const Accountdetails = () => {
  const user = React.useContext(UserActive);
  const [tracking, setTracking] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/account/movements", {
        params: {
          email: user.email,
        },
      })
      .then((resp) => {
        console.log(resp.data);
        let movements = resp.data;
        setTracking([...movements]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="m-3">
      <h1>Account Details</h1>
      <hr />
      {!user.name ? (
        <div style={{ color: "red" }}>
          You need to login to see the last movements record
        </div>
      ) : (
        <>
          <p className="m-2" style={{ fontSize: "1.25rem" }}>
            Last movements record
          </p>
          <table className="table table-striped text-center">
            <thead className="table-primary">
              <tr>
                <th scope="col">Deposit</th>
                <th scope="col">Withdraw</th>
                <th scope="col">Balance</th>
              </tr>
            </thead>
            <tbody>
              {tracking.map(
                (item, index) =>
                  user.name != '' && (
                    <tr key={index}>
                      {item.operationid == 0 ? (
                        <>
                          <td></td>
                          <td>${item.amount}</td>
                        </>
                      ) : (
                        <>
                          <td>${item.amount}</td>
                          <td></td>
                        </>
                      )}
                      <td>${item.balance}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Accountdetails;
