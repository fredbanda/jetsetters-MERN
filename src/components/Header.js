import React, { useState } from "react";
import {
  MDBCollapse,
  MDBContainer,
  MDBIcon,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBNavbarToggler,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/features/authSlice";
import { searchTours } from "../redux/features/tourSlice";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";

const Header = () => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
 const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = user?.token;

  if (token) {
    const decodedToken = decode(token);
    if (decodedToken.exp * 1000 < new Date().getTime()) {
      dispatch(setLogout());
    }
  }

  const handleSubmit = (e) => { 
    e.preventDefault();
    if (search) {
      dispatch(searchTours(search));
      navigate(`/tours/search?searchQuery=${search}`);
      setSearch("");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    dispatch(setLogout());
  }
  
  return (
    <MDBNavbar fixed="top" expand="lg" style={{ backgroundColor: "#00AAF8" }}>
      <MDBContainer>
        <MDBNavbarBrand
          href="/"
          style={{ color: "#fff", fontWeight: "600", fontSize: "22px", marginTop: "-10px" }}
        >
          JetSetters
        </MDBNavbarBrand>
        <MDBNavbarToggler
          type="button"
          aria-expanded="false"
          aria-label="Toggle navagation"
          onClick={() => setShow(!show)}
          style={{ color: "#fff" }}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>
        <MDBCollapse show={show} navbar>
          <MDBNavbarNav right fullWidth={false} className=" mb-2 mb-lg-0">
            {user?.result?._id && (
              <h5 style={{marginRight: "30px", marginTop: "18px", color: "#fff"}}>Welcome Back:  {user?.result?.name}</h5>
            )}
            <MDBNavbarItem>
              <MDBNavbarLink href="/">
                <p className="header-text">Home</p>
              </MDBNavbarLink>
            </MDBNavbarItem>
            {user?.result?._id && (
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink href="/addTour">
                    <p className="header-text">Add-A-JetSet</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href="/dashboard">
                    <p className="header-text">Dashboard</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </>
            )}
            {user?.result?._id ? (
              <MDBNavbarItem>
                <MDBNavbarLink href="/login">
                  <p className="header-text" onClick={handleLogout}>Logout</p>
                </MDBNavbarLink>
              </MDBNavbarItem>
            ) : (
              <MDBNavbarItem>
                <MDBNavbarLink href="/login">
                  <p className="header-text">Login</p>
                </MDBNavbarLink>
              </MDBNavbarItem>
            )}
          </MDBNavbarNav>
          <form className="d-flex input-group w-auto" onSubmit={handleSubmit}>
            <input
              type="text"
              style={{borderRadius: "35px", marginTop: "-5px"}}
              className="form-control"
              placeholder="Search A Jetset"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ mrginTop: "5px", marginLeft: "5px"}}>
            <MDBIcon fas icon="search"/>
            </div>
          </form>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Header;
