const Image = ({file, img, size}) => {

    return (
        <img className={`h-${size} hover:scale-125`} src={file} alt={`${img} icon`}/>
    )
}

export default Image