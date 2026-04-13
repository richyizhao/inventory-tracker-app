namespace inventory_management.Server.Services.DemoData;

internal static class DemoDataSeedDefinitions
{
    public static readonly string[] DemoRoleNames =
    [
        Authentication.SeedData.AdminRoleName,
        Authentication.SeedData.ManagerRoleName,
        Authentication.SeedData.StaffRoleName,
    ];

    public static readonly (string Name, string Email, string RoleName)[] DemoUsers =
    [
        ("Demo Ops Lead", "ops-lead@demo.invtra.local", Authentication.SeedData.ManagerRoleName),
        ("Demo Warehouse", "warehouse@demo.invtra.local", Authentication.SeedData.StaffRoleName),
        ("Demo Purchasing", "purchasing@demo.invtra.local", Authentication.SeedData.ManagerRoleName),
        ("Demo Storefront", "storefront@demo.invtra.local", Authentication.SeedData.StaffRoleName),
    ];

    public static readonly IReadOnlyDictionary<string, string[]> ProductCatalog =
        new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
        {
            ["CPU"] = ["Ryzen 5 7500F", "Ryzen 7 7800X3D", "Core i5-14600KF", "Core i7-14700K"],
            ["GPU"] = ["GeForce RTX 4060", "GeForce RTX 4070 SUPER", "Radeon RX 7800 XT", "GeForce RTX 4090"],
            ["RAM"] = ["Corsair Vengeance DDR5 32GB", "G.Skill Trident Z5 RGB 32GB", "Kingston Fury Beast 16GB", "Crucial Pro DDR5 64GB"],
            ["Motherboard"] = ["MSI B650 Tomahawk WiFi", "ASUS TUF Gaming B760-Plus WiFi", "Gigabyte X670 Aorus Elite AX", "ASRock B550M Pro4"],
            ["Storage"] = ["Samsung 990 Pro 2TB", "WD Black SN850X 1TB", "Crucial T500 2TB", "Seagate FireCuda 530 1TB"],
            ["PSU"] = ["Corsair RM750e", "Seasonic Focus GX-850", "MSI MAG A750GL", "be quiet! Pure Power 12 M 850W"],
            ["PC Cases"] = ["NZXT H6 Flow", "Lian Li Lancool 216", "Corsair 4000D Airflow", "Fractal Design North"],
            ["CPU Cooler"] = ["DeepCool AK620", "Noctua NH-D15", "NZXT Kraken 240", "Thermalright Phantom Spirit 120"],
            ["Case Fans"] = ["Lian Li Uni Fan SL120", "Arctic P12 PWM PST", "Corsair AF120 RGB Elite", "Noctua NF-A12x25"],
            ["Thermal Paste"] = ["Thermal Grizzly Kryonaut", "Arctic MX-6", "Noctua NT-H2", "Cooler Master CryoFuze"],
            ["Expansion Cards"] = ["TP-Link Archer TX3000E", "Elgato 4K60 Pro MK.2", "ASUS Xonar SE", "Blackmagic DeckLink Mini Recorder 4K"],
            ["Laptops"] = ["ASUS TUF Gaming A15", "Lenovo Legion Slim 5", "MacBook Air 15 M3", "Dell XPS 14"],
            ["Workstations"] = ["HP Z2 Tower G9", "Lenovo ThinkStation P3", "Dell Precision 3680", "Mac Studio M2 Max"],
            ["Gaming PCs"] = ["Alienware Aurora R16", "MSI Infinite RS 14", "HP Omen 45L", "Corsair Vengeance i7400"],
            ["Mini PCs"] = ["Intel NUC 13 Pro", "Beelink SER7", "Minisforum UM790 Pro", "ASUS ExpertCenter PN64"],
            ["All-in-One PCs"] = ["HP Envy Move 23.8", "Lenovo IdeaCentre AIO 5", "iMac 24 M3", "Dell Inspiron 27 All-in-One"],
            ["Refurbished Systems"] = ["Dell OptiPlex 7090 Refurbished", "HP EliteDesk 800 G6 Refurbished", "Lenovo ThinkCentre M720 Refurbished", "Mac mini M1 Refurbished"],
            ["Smartphones"] = ["iPhone 15", "Samsung Galaxy S24", "Google Pixel 8", "Nothing Phone (2a)"],
            ["Tablets"] = ["iPad Air 13", "Samsung Galaxy Tab S9", "Lenovo Tab P12", "Microsoft Surface Pro 10"],
            ["Smartwatches"] = ["Apple Watch Series 9", "Samsung Galaxy Watch6", "Garmin Venu 3", "Google Pixel Watch 2"],
            ["Keyboards"] = ["Keychron Q1 Max", "Logitech MX Mechanical", "Razer BlackWidow V4", "SteelSeries Apex Pro TKL"],
            ["Mice"] = ["Logitech G Pro X Superlight 2", "Razer DeathAdder V3 Pro", "Logitech MX Master 3S", "SteelSeries Prime Wireless"],
            ["Mouse Pads"] = ["Logitech G840 XL", "SteelSeries QcK Heavy", "Razer Gigantus V2", "Corsair MM700 RGB"],
            ["Speakers"] = ["Audioengine A2+", "Edifier R1280DB", "Creative Pebble Pro", "Logitech Z407"],
            ["Microphones"] = ["Shure MV7", "Elgato Wave:3", "Rode NT-USB+", "HyperX QuadCast S"],
            ["Webcams"] = ["Logitech Brio 4K", "Insta360 Link", "Razer Kiyo Pro Ultra", "Elgato Facecam MK.2"],
            ["Drawing Tablets"] = ["Wacom Intuos Pro Medium", "XP-Pen Artist 13.3 Pro", "Huion Kamvas 16", "Wacom One 13 Touch"],
            ["Routers"] = ["ASUS RT-AX88U Pro", "TP-Link Archer AX73", "Netgear Nighthawk RS300", "eero Pro 6E"],
            ["Modems"] = ["Netgear Nighthawk CM2000", "ARRIS Surfboard S33", "Motorola MB8611", "TP-Link Deco X50-5G"],
            ["Network Switches"] = ["TP-Link TL-SG108", "Netgear GS308E", "Ubiquiti UniFi Switch Lite 16", "MikroTik CSS610-8G-2S+IN"],
            ["Access Points"] = ["Ubiquiti UniFi U6 Pro", "TP-Link Omada EAP670", "Aruba Instant On AP22", "Netgear WAX615"],
            ["Cables"] = ["Anker USB-C to USB-C Cable", "UGREEN DisplayPort 1.4 Cable", "Belkin HDMI 2.1 Cable", "Cable Matters Cat6 Ethernet Cable"],
            ["Adapters"] = ["Apple USB-C to HDMI Adapter", "Anker USB-C Hub 555", "TP-Link USB WiFi Adapter", "UGREEN SATA to USB Adapter"],
            ["Chargers"] = ["Anker Prime 100W GaN Charger", "UGREEN Nexode 65W", "Belkin BoostCharge Pro 3-in-1", "Samsung 45W USB-C Charger"],
            ["Power Banks"] = ["Anker 737 Power Bank", "Baseus Blade 100W", "UGREEN 145W Power Bank", "INIU 20000mAh USB-C PD"],
            ["Cable Management"] = ["Joto Cable Sleeve Kit", "UGREEN Cable Organizer Box", "Bluelounge CableDrop", "Velcro One-Wrap Ties"],
            ["Mounts & Stands"] = ["Ergotron LX Monitor Arm", "Twelve South Curve", "Lamicall Laptop Stand", "Elgato Master Mount L"],
        };

    public static readonly IReadOnlyDictionary<string, (decimal Min, decimal Max)> SubCategoryCostRanges =
        new Dictionary<string, (decimal Min, decimal Max)>(StringComparer.OrdinalIgnoreCase)
        {
            ["CPU"] = (140m, 620m),
            ["GPU"] = (320m, 2100m),
            ["RAM"] = (35m, 260m),
            ["Motherboard"] = (95m, 420m),
            ["Storage"] = (70m, 280m),
            ["PSU"] = (75m, 220m),
            ["PC Cases"] = (70m, 220m),
            ["CPU Cooler"] = (28m, 190m),
            ["Case Fans"] = (12m, 95m),
            ["Thermal Paste"] = (6m, 22m),
            ["Expansion Cards"] = (25m, 320m),
            ["Laptops"] = (780m, 2400m),
            ["Workstations"] = (1400m, 4200m),
            ["Gaming PCs"] = (1500m, 4300m),
            ["Mini PCs"] = (320m, 980m),
            ["All-in-One PCs"] = (650m, 2200m),
            ["Refurbished Systems"] = (180m, 950m),
            ["Smartphones"] = (280m, 1300m),
            ["Tablets"] = (180m, 1600m),
            ["Smartwatches"] = (160m, 650m),
            ["Keyboards"] = (45m, 220m),
            ["Mice"] = (28m, 180m),
            ["Mouse Pads"] = (8m, 65m),
            ["Speakers"] = (30m, 280m),
            ["Microphones"] = (45m, 260m),
            ["Webcams"] = (40m, 260m),
            ["Drawing Tablets"] = (55m, 650m),
            ["Routers"] = (65m, 420m),
            ["Modems"] = (75m, 480m),
            ["Network Switches"] = (20m, 220m),
            ["Access Points"] = (65m, 240m),
            ["Cables"] = (6m, 35m),
            ["Adapters"] = (10m, 95m),
            ["Chargers"] = (12m, 140m),
            ["Power Banks"] = (18m, 130m),
            ["Cable Management"] = (6m, 38m),
            ["Mounts & Stands"] = (14m, 180m),
        };

    public static readonly IReadOnlyDictionary<string, (decimal Min, decimal Max)> ProductCostOverrides =
        new Dictionary<string, (decimal Min, decimal Max)>(StringComparer.OrdinalIgnoreCase)
        {
            ["TP-Link TL-SG108"] = (22m, 82m),
            ["Netgear GS308E"] = (28m, 95m),
            ["Ubiquiti UniFi Switch Lite 16"] = (150m, 240m),
            ["MikroTik CSS610-8G-2S+IN"] = (95m, 180m),
        };
}
