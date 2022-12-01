import Card from "../Card";

const Home = () => {

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card
            bgcolor="primary bg-opacity-10 "
            txtcolor="dark text-center"
            header="Welcome to the Bad Bank"
            title="The bank that looks good, works well but does not handle your information well"
            text="Feel insecure to work with us (for now)"
            body={<img src="BankLogo.png" className="img-fluid" alt="Responsive image"/>}
        />
    </div>
  );
}

export default Home;