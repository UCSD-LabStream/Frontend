import React from 'react';

const TextCard = ({title, content}) => {
    return (
        <div style={styles.card}>
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
      width: '300px',
      margin: '10px',
      border: '8px solid rgb(1, 149, 165)',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    content: {
      fontSize: '14px',
      color: '#000',
    },
  };

export default TextCard;