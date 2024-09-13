import PropTypes from "prop-types";
const TableRow = ({ record }) => {
  return (
    <tr>
      {Object.values(record).map((value, index) => (
        <td key={index}>{value}</td>
      ))}
    </tr>
  );
};
TableRow.propTypes = { record: PropTypes.object.isRequired };
export default TableRow;
