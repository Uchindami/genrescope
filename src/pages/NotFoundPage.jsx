import React, { useState } from "react";

const NotFoundPage = () => {
  return (
    <div
      className="absolute inset-0 bg-primary-body-light min-h-screen w-full font-colfaxAIBold
	  overflow-hidden text-headings-light bg-grid-slate-400/[0.05] "
    >
      <div className="min-h-screen bg-base-200 flex items-center ">
        <div className="container mx-auto text-center py-20">
          <h1 className="text-6xl font-semibold">404</h1>
          <p className="text-xl mt-5">Page not found</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
