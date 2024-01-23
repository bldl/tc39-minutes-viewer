import styled from "styled-components";

const LeftBoxCont = styled.div`
  position: absolute;
  width: 50%; /* Set the width to 100% */
`;

interface Props {
  text: String;
}

const LeftBoxContent = ({ text }: Props) => {
  return (
    <div>
      <LeftBoxCont>
        <p>{text}</p>
      </LeftBoxCont>

      {/* Add any additional content for the LeftBox */}
    </div>
  );
};

export default LeftBoxContent;
