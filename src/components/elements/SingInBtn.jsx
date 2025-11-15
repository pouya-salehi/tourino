"use client";
import { BeatLoader } from "react-spinners";
const SignInBtn = ({ loading, onClick, phone }) => {
  return (
    <button
      className="py-4 rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer w-full"
      onClick={onClick}
      disabled={loading || !phone}
      type="submit"
    >
      {loading ? <BeatLoader size={8} color="#ffffff" /> : "ارسال کد"}
    </button>
  );
};

export default SignInBtn;
