const PageNotFound = () => {
    return (
        <div className="container">
            <br></br>
            <h1>404
                <p>Stranica ne postoji</p>
                <p>Page not found</p>
            </h1>
            <a href="/" data-testid="home-link" className="back">
                    početna / home
            </a>
        </div>
    )
}

export default PageNotFound
