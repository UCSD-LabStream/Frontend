const WideTextCard = ({title, content, onClose}) => {
    return (
        <div style={styles.card}>
          <button onClick={onClose} style={styles.closeButton}>×</button>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.content}>{content}</p>
        </div>
      );
}


const styles = {
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '60%',
      margin: '10px',
      border: '8px solid #23486A',
      position: 'relative',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '15px',
      background: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#23486A',
  },
    content: {
      fontSize: '14px',
      color: '#000',
    },
  };

export default WideTextCard