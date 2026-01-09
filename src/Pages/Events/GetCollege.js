import collegeData from "../SignUp/collegeData";

const GetCollege = (val) => {
  var clg = collegeData.find((item) => item.value === val);

  return clg.label;
};

export default GetCollege;
