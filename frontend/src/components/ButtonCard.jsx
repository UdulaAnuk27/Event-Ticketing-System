const ButtonCard = ({ title, color, onClick }) => {
  const styles = {
    container: {
      width: "200px",
      height: "150px",
      backgroundColor: color,
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      borderRadius: "15px",
      boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
      fontSize: "20px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div
      style={styles.container}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {title}
    </div>
  );
};

export default ButtonCard;
