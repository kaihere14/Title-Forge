import React from "react";
import Meta from "../components/Meta";
import PricingSection from "../components/Pricing";
const Pricing = () => {
  return (
    <div>
      <Meta
        title="Pricing — TitleForge"
        description="Choose a plan that fits your needs — TitleForge offers Starter and Pro plans for creators seeking more credits and features."
        url="https://title-forge.vercel.app/pricing"
      />
      <PricingSection />
    </div>
  );
};

export default Pricing;
