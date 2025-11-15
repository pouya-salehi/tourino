"use client";
import { BeatLoader } from "react-spinners";
const SignUpBtn = ({ loading, onClick }) => {
  return (
    <button
      className="py-4 rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer"
      onClick={onClick}
      disabled={loading}
      type="submit"
    >
      {loading ? <BeatLoader size={8} color="#ffffff" /> : "ارسال کد"}
    </button>
  );
};

export default SignUpBtn;
