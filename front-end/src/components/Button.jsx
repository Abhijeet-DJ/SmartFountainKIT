export function Button({ id, name, onClick, color }) {
    return (
        <button 
            id={id} 
            onClick={onClick} 
            style={{ 
                padding: '10px 20px', 
                margin: '5px', 
                backgroundColor: color, 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
            }}
        >
            {name}
        </button>
    );
}
