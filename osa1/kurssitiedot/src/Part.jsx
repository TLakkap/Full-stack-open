const Part = (props) => {
    return(
        <div>
            <p>{props.part.name} {props.part.exercises}</p>
        </div>
    )
}

export default Part