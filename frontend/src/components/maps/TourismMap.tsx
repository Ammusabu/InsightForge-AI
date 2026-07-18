import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function TourismMap() {

    const destinations = [
        {
            name: "Delhi",
            position: [28.6139, 77.2090] as [number, number],
        },
        {
            name: "Goa",
            position: [15.2993, 74.1240] as [number, number],
        },
        {
            name: "Kerala",
            position: [10.8505, 76.2711] as [number, number],
        },
        {
            name: "Jaipur",
            position: [26.9124, 75.7873] as [number, number],
        },
        {
            name: "Agra",
            position: [27.1767, 78.0081] as [number, number],
        },
        {
            name: "Mumbai",
            position: [19.0760, 72.8777] as [number, number],
        },
    ];

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <h2 className="mb-4 text-xl font-bold text-white">
                🌍 Tourism Map
            </h2>

            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{
                    height: "420px",
                    width: "100%",
                    borderRadius: "16px",
                }}
            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {destinations.map((place) => (

                    <Marker
                        key={place.name}
                        position={place.position}
                    >

<Popup>

<div className="w-52">

    <h3 className="text-lg font-bold">
        {place.name}
    </h3>

    <hr className="my-2" />

    <p>
        👥 Visitors: 2.4 Million
    </p>

    <p>
        💰 Revenue: ₹180 Crores
    </p>

    <p>
        ⭐ Rating: 4.8 / 5
    </p>

    <p>
        🌴 Category: Tourism
    </p>

</div>

</Popup>

                    </Marker>

                ))}

            </MapContainer>

        </div>

    );

}