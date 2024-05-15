import { Link } from "react-scroll";

export function Footer() {
  return (
    <footer className="bg-white-500">
      <div className="mx-auto w-full max-w-7xl p-4 py-4 lg:py-6"> {/* Adjusted padding */}
        <hr className="my-4 border-black sm:mx-auto lg:my-6" /> {/* Adjusted margin and padding */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-black sm:text-center">
            © {new Date().getFullYear()}
            {" Mental Health Detection Website"}
            <Link
              activeClass="active"
              to={"home"}
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="font-bold"
            >
              . All Rights Reserved.
            </Link>
          </span>          
        </div>
      </div>
    </footer>
  );
}

export default Footer;
