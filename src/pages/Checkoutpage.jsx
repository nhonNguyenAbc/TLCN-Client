import React from "react";
import { Step, Stepper } from "@material-tailwind/react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Container } from "@mui/material";
import Step1Checkout from "../components/restaurant/Step1Checkout";
import Step2Checkout from "../components/restaurant/Step2Checkout";
import Step3Checkout from "../components/restaurant/Step3Checkout";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation } from "react-router-dom";
const Checkoutpage = () => {
  const location = useLocation();
  const { restaurantId } = location.state || {};
  console.log("idcheckout:", restaurantId);
  const queryParams = new URLSearchParams(location.search);
  const stepFromQuery = parseInt(queryParams.get("step"), 10);
  const [activeStep, setActiveStep] = React.useState(stepFromQuery || 0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <>
      <div className="mt-5 w-1/2 mx-auto">
        <Stepper
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
          activeLineClassName="bg-[#FF333A]"
        >
          <Step
            onClick={() => setActiveStep(0)}
            activeClassName="ring-0 !bg-[#FF333A] text-white"
            completedClassName="!bg-[#FF333A] text-white"
          >
            <ShoppingCartIcon className="h-5 w-5" />
          </Step>
          {/* <Step
            onClick={() => setActiveStep(1)}
            activeClassName="ring-0 !bg-[#FF333A] text-white"
            completedClassName="!bg-[#FF333A] text-white"
          >
            <ReceiptIcon className="h-5 w-5" />
          </Step> */}
          <Step
            onClick={() => setActiveStep(1)}
            activeClassName="ring-0 !bg-[#FF333A] text-white"
            completedClassName="!bg-[#FF333A] text-white"
          >
            <CheckCircleIcon className="h-5 w-5" />
          </Step>
        </Stepper>
      </div>
      {activeStep === 0 && (
        <Step1Checkout restaurantId={restaurantId} handleNext={handleNext} />
      )}
      {/* {activeStep === 1 && (
        <Step2Checkout handleNext={handleNext} handlePrev={handlePrev} />
      )} */}
      {activeStep === 1 && <Step3Checkout />}
    </>
  );
};

export default Checkoutpage;
