# Capacity Map demo

- **URL:** `https://appointment-capacity-map.sociobot.in/demo`
- **Alias:** `https://appointment-capacity-map.sociobot.in/?demo=1`
- **Start:** choose **Try it with sample data** on the first screen.
- **Sample:** Ava and Leo; Consultation, Treatment, and Mobile visit; one chair,
  one van, a service-pair rule, and three jobs on the current day.
- **Storage:** IndexedDB database `capacity-map`, object store `notebook`, key
  `demo:capacity`. Normal data uses the separate key `capacity`.
- **Reset:** **Reset demo** replaces demo changes with the shipped sample.
- **Exit:** **Start for real** deletes `demo:capacity` before opening the real
  notebook. Demo mode never reads or writes the `capacity` key.
- **Paid preview:** the two-week review is open inside the demo. It does not
  read, store, or verify a real license.
- **Offline:** visit the demo online once, wait for service-worker installation,
  then reload it without a network connection.
