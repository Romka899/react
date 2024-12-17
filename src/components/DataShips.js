function DataShips(props){
    const { ships } =  props;
    if (!ships || ships.length === 0) return <p>Нет данных.</p>

    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>model</th>
                        <th>manufacturer</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ships.map((ships) =>
                            <tr key={ships.name}>
                                <td>{ships.name}</td>
                                <td>{ships.model}</td>
                                <td>{ships.manufacturer}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
      </div>
    )
}

export default DataShips