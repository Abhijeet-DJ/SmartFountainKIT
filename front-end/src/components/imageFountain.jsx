export function FountainImg({ rgb }) { 
   
    return (
        <div className="Image-Fountain" 
            style={{ border: `10px solid rgb(${rgb.R}, ${rgb.G}, ${rgb.B})` }}
        ></div>
    );
}
