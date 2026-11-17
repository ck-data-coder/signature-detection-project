import React from "react";



import "./Header.css";




const Header = (props) => {

    
  return (
  <div className="container-fluid bg-light py-2  w-100" >
  <div className="d-flex justify-content-between align-items-center">
    
    {/* Logo and Name */}
    <div className="d-flex align-items-center" style={{padding:"42px",position:"relative",height:"70px"}}>
      <h3 className="mb-0">signature detection</h3>
    </div>

    {/* Account Balance & ToggleSlider aligned right */}

</div>

  </div>

  );
};

export default Header;
