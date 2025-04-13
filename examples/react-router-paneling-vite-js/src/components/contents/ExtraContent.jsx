export default function ExtraContent({ id }) {
    return (
        <div className="extra-content">
            <h1>Extra panel</h1>
            {id ? <p>My ID is {id} &#128513;</p> : <p>I have no ID &#128517;</p>}
        </div>
    );
}

