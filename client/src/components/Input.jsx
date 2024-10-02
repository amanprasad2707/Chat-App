import React from "react";

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative">
      <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-primary" />
      </div>
      <input {...props} className="w-full pl-10 bg-slate-100 outline-none border-2 focus:border-primary rounded p-1" />
    </div>
  );
};

export default Input;
