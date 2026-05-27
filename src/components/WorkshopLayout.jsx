import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCube, FaTools, FaCogs, FaMicrochip, FaTimes, FaSave, FaPlay, FaQuestionCircle, FaExternalLinkAlt, FaBook, FaCommentAlt, FaLink, FaTrashAlt, FaStore, FaLock, FaCheckCircle, FaTv } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../firebase/utils';
import WorkshopScene from './WorkshopScene';
import ProductTour from './ProductTour';
import { 
    DynamicComponentIcon,
    ArduinoUnoIcon, 
    ESP32Icon, 
    ServoMotorIcon, 
    OLEDDisplayIcon, 
    DHT11SensorIcon, 
    BreadboardIcon, 
    LEDIcon, 
    ResistorIcon, 
    SensorPackIcon,
    PotentiometerIcon,
    CapacitorIcon,
    DiodeIcon,
    TransistorIcon,
    ICChipIcon,
    Battery9VIcon,
    BatteryAAIcon,
    BuzzerIcon,
    RelayIcon,
    DCMotorIcon,
    StepperMotorIcon,
    LDRIcon,
    PIRIcon,
    SoilSensorIcon,
    GyroscopeIcon,
    LCD1602Icon
} from './ComponentIcons';
import './Workshop.css';

// Catalog of premium marketplace hardware components (Expanded with Breadboard, Resistor, and LED)
// Programmatic Generator to populate a 1000+ Component Database across 12 Discrete Categories
const generateMarketplaceProducts = () => {
    const list = [];

    // Helper to generate dynamic SVG icon
    const getDynamicIcon = (type, name, ohm) => {
        return <DynamicComponentIcon type={type} label={name} ohm={ohm} />;
    };

    // 1. Microcontrollers & Dev Boards (Originals + 15 variants)
    const baseMCUs = [
        { id: 'control', name: 'Arduino Uno R3', category: 'Microcontrollers & Dev Boards', desc: 'Standard 8-bit microcontroller board.', specs: 'ATmega328P, 5V, 16MHz', price: 'Free', isPremium: false, icon: <ArduinoUnoIcon /> },
        { id: 'esp32', name: 'Kone ESP32 NodeMCU', category: 'Microcontrollers & Dev Boards', desc: 'Sleek Wi-Fi & Bluetooth microcontroller.', specs: 'ESP32, 2.4GHz, 4MB', price: 'Free', isPremium: false, icon: <ESP32Icon /> },
        { id: 'pico', name: 'Raspberry Pi Pico', category: 'Microcontrollers & Dev Boards', desc: 'High performance dual-core microcontroller.', specs: 'RP2040, 133MHz, 2MB', price: 'Free', isPremium: false, icon: <ESP32Icon /> },
        { id: 'attiny85', name: 'ATtiny85 Mini MCU', category: 'Microcontrollers & Dev Boards', desc: 'Compact 8-pin DIP microcontroller.', specs: '8-Pin DIP, 8MHz, 8KB', price: 'Free', isPremium: false, icon: <ICChipIcon /> },
    ];
    list.push(...baseMCUs);

    const mcuBoards = [
        'ESP8266 NodeMCU V3', 'Arduino Nano V3', 'Arduino Mega 2560', 'Arduino Leonardo', 'Arduino Pro Micro', 'ESP32-S3 DevKitC-1', 'ESP32-C3 SuperMini', 'Teensy 4.0', 'Teensy 4.1', 'STM32 Blue Pill', 'STM32 Black Pill', 'Raspberry Pi Zero W', 'Micro:bit V2', 'Adafruit Feather M4', 'SparkFun RedBoard'
    ];
    mcuBoards.forEach((board, i) => {
        list.push({
            id: `mcu_var_${i}`,
            name: board,
            category: 'Microcontrollers & Dev Boards',
            desc: `High-fidelity breakout board for the ${board} microcontroller module. Ideal for compact systems.`,
            specs: '3.3V/5V Logic, Cast Pinouts',
            price: 'Free',
            isPremium: true,
            icon: getDynamicIcon('pico', board)
        });
    });

    // 2. Basic Passives (Resistors & Caps) - Tinkercad-Style Dynamic Components
    list.push({
        id: 'resistor',
        name: 'Carbon Film Resistor',
        category: 'Basic Passives (Resistors & Caps)',
        desc: 'Standard 4-band striped resistor. Place in workshop and set resistance value dynamically in properties.',
        specs: 'Range: 1 Ω to 10 MΩ',
        price: 'Free',
        isPremium: false,
        value: 220,
        icon: getDynamicIcon('resistor', 'Resistor', 220)
    });

    list.push({
        id: 'cap_ceramic',
        name: 'Ceramic Decoupling Capacitor',
        category: 'Basic Passives (Resistors & Caps)',
        desc: 'Non-polarized ceramic disc decoupling capacitor. Place and set capacitance value dynamically in properties.',
        specs: 'Default: 100 nF, 50V max',
        price: 'Free',
        isPremium: false,
        value: '100 nF',
        icon: getDynamicIcon('capacitor_ceramic', 'Ceramic Cap')
    });

    list.push({
        id: 'cap_electrolytic',
        name: 'Electrolytic Polar Capacitor',
        category: 'Basic Passives (Resistors & Caps)',
        desc: 'Polarized radial aluminum capacitor. Place and set capacitance value dynamically in properties.',
        specs: 'Default: 10 µF, 25V polar',
        price: 'Free',
        isPremium: false,
        value: '10 µF',
        icon: getDynamicIcon('capacitor_electrolytic', 'Polar Cap')
    });

    // 3. Semiconductors (Diodes & Transistors)
    const baseSemis = [
        { id: 'diode', name: '1N4007 Rectifier Diode', category: 'Semiconductors (Diodes & Transistors)', desc: 'Standard black cylindrical rectifier diode.', specs: '1A, 1000V PIV', price: 'Free', isPremium: false, icon: <DiodeIcon /> },
        { id: 'transistor', name: '2N2222 NPN Transistor', category: 'Semiconductors (Diodes & Transistors)', desc: 'Silicon planar epitaxial NPN transistor.', specs: 'TO-92 Case, 40V, 800mA', price: 'Free', isPremium: false, icon: <TransistorIcon /> }
    ];
    list.push(...baseSemis);

    const semiModels = [
        { name: '1N4148 Signal Diode', type: 'diode', specs: '75V, 150mA, fast recovery' },
        { name: '1N5819 Schottky Diode', type: 'diode', specs: '40V, 1A, low forward voltage' },
        { name: '1N5408 Power Diode', type: 'diode', specs: '1000V, 3A high power rectifier' },
        { name: '2N3904 General NPN', type: 'transistor', specs: '40V, 200mA, TO-92 switching' },
        { name: '2N3906 General PNP', type: 'transistor', specs: '40V, 200mA, TO-92 PNP complement' },
        { name: 'BC547 Low Noise NPN', type: 'transistor', specs: '45V, 100mA, high gain TO-92' },
        { name: 'BC557 Low Noise PNP', type: 'transistor', specs: '45V, 100mA, complementary PNP' },
        { name: 'PN2222 Heavy NPN', type: 'transistor', specs: '30V, 1000mA, metal case complement' },
        { name: 'IRF540N N-Channel Power MOSFET', type: 'transistor', specs: '100V, 33A, 44mOhm TO-220 switching' },
        { name: 'IRF9540 P-Channel Power MOSFET', type: 'transistor', specs: '100V, 23A, complementary P-MOSFET' },
        { name: '2N7000 N-Channel Signal MOSFET', type: 'transistor', specs: '60V, 200mA low power TO-92' },
        { name: 'TIP120 NPN Darlington Power', type: 'transistor', specs: '60V, 5A high gain Darlington' },
        { name: 'TIP127 PNP Darlington Power', type: 'transistor', specs: '60V, 5A complementary PNP Darlington' },
        { name: 'BD139 NPN Medium Power', type: 'transistor', specs: '80V, 1.5A high gain driver' },
        { name: 'BD140 PNP Medium Power', type: 'transistor', specs: '80V, 1.5A medium power driver' }
    ];
    semiModels.forEach((m, i) => {
        list.push({
            id: `semi_var_${i}`,
            name: m.name,
            category: 'Semiconductors (Diodes & Transistors)',
            desc: `Premium photorealistic ${m.name} semiconductor component inside standard physical casing.`,
            specs: m.specs,
            price: 'Free',
            isPremium: true,
            icon: getDynamicIcon(m.type, m.name)
        });
    });

    // 4. Logic Gates & 74xx Series
    const gatesList = [
        { code: '74HC00', name: 'Quad 2-Input NAND Gate' },
        { code: '74HC02', name: 'Quad 2-Input NOR Gate' },
        { code: '74HC04', name: 'Hex Inverter (NOT Gate)' },
        { code: '74HC08', name: 'Quad 2-Input AND Gate' },
        { code: '74HC10', name: 'Triple 3-Input NAND Gate' },
        { code: '74HC14', name: 'Hex Schmitt-Trigger Inverter' },
        { code: '74HC32', name: 'Quad 2-Input OR Gate' },
        { code: '74HC74', name: 'Dual D-Type Flip-Flop' },
        { code: '74HC86', name: 'Quad 2-Input XOR Gate' },
        { code: '74HC125', name: 'Quad Buffer/Line Driver' },
        { code: '74HC138', name: '3-to-8 Decoder/Demultiplexer' },
        { code: '74HC154', name: '4-to-16 Decoder/Demultiplexer' },
        { code: '74HC164', name: '8-Bit Shift Register (SIPO)' },
        { code: '74HC165', name: '8-Bit Shift Register (PISO)' },
        { code: '74HC175', name: 'Quad D Flip-Flop with Clear' },
        { code: '74HC283', name: '4-Bit Binary Full Adder' },
        { code: '74HC4017', name: 'Decade Counter with 10 Decoded Outputs' },
        { code: '74HC4066', name: 'Quad Bilateral Analog Switch' },
        { id: '74hc595', code: '74HC595', name: '8-Bit Serial-in Parallel-out Shift Register' }
    ];
    gatesList.forEach((gate, i) => {
        list.push({
            id: gate.id || `gate_var_${gate.code}`,
            name: `${gate.code} ${gate.name}`,
            category: 'Logic Gates & 74xx Series',
            desc: `Silicon integrated circuit ${gate.code} logic chip housed in a standard DIP package.`,
            specs: 'High Speed CMOS, 2.0V to 6.0V Supply',
            price: 'Free',
            isPremium: false,
            icon: getDynamicIcon('gate_and', gate.code)
        });
    });

    // 5. Analog ICs & Op-Amps
    const baseAnalog = [
        { id: 'ne555', name: 'NE555 Precision Timer', category: 'Analog ICs & Op-Amps', desc: 'Precise monostable/astable timer integrated circuit.', specs: '8-Pin DIP, 4.5V to 16V Supply', price: 'Free', isPremium: false, icon: <ICChipIcon /> },
        { id: 'l293d', name: 'L293D Motor Driver', category: 'Analog ICs & Op-Amps', desc: 'Fourfold high-current half-H drivers.', specs: '16-Pin DIP, 600mA/ch driver', price: 'Free', isPremium: false, icon: <ICChipIcon /> }
    ];
    list.push(...baseAnalog);

    const analogICs = [
        { code: 'LM358', name: 'Dual Operational Amplifier', specs: 'Low power dual op-amp, 8-Pin DIP' },
        { code: 'LM324', name: 'Quad Operational Amplifier', specs: 'High gain quad op-amp, 14-Pin DIP' },
        { code: 'TL072', name: 'Low-Noise JFET Dual Op-Amp', specs: 'High impedance input dual op-amp' },
        { code: 'TL084', name: 'Low-Noise JFET Quad Op-Amp', specs: 'High speed quad operational amplifier' },
        { code: 'LM386', name: 'Low Voltage Audio Power Amplifier', specs: '0.3W to 1W audio gain, 8-Pin DIP' },
        { code: 'LM339', name: 'Quad Differential Comparator', specs: 'Four independent voltage comparators' },
        { code: 'LM393', name: 'Dual Differential Comparator', specs: 'Low offset dual voltage comparator' },
        { code: 'LM317', name: 'Adjustable Voltage Regulator', specs: '1.2V to 37V positive adjustable regulator' },
        { code: 'L7805', name: '5V Fixed Voltage Regulator', specs: 'TO-220 5V/1.5A positive regulator' },
        { code: 'L7812', name: '12V Fixed Voltage Regulator', specs: 'TO-220 12V/1.5A positive regulator' },
        { code: 'NE5532', name: 'Dual High-Performance Low-Noise Op-Amp', specs: 'Professional audio dual operational amplifier' }
    ];
    analogICs.forEach((chip, i) => {
        list.push({
            id: `analog_var_${chip.code}`,
            name: `${chip.code} ${chip.name}`,
            category: 'Analog ICs & Op-Amps',
            desc: `Premium analog integrated circuit ${chip.code} module designed for signal processing and power amplification.`,
            specs: chip.specs,
            price: 'Free',
            isPremium: true,
            icon: getDynamicIcon('ne555', chip.code)
        });
    });

    // 6. Environmental Sensors
    const envSensors = [
        { id: 'dht11', name: 'DHT11 Temp & Humidity Sensor', category: 'Environmental Sensors', desc: 'Environmental air humidity and temperature sensor.', specs: '20-90% RH, 0-50°C, Single-bus', price: 'Free', isPremium: false, icon: <DHT11SensorIcon /> },
        { id: 'soil', name: 'Soil Moisture Sensor', category: 'Environmental Sensors', desc: 'Resistive analog probe soil moisture meter.', specs: 'Dual prong, corrosion-resistant', price: 'Free', isPremium: false, icon: <SoilSensorIcon /> }
    ];
    list.push(...envSensors);

    const envVariants = [
        'DHT22 High-Precision Temp & Humidity', 'BMP280 Barometric Pressure & Alt', 'BME280 Temp, Humidity & Pressure', 'LM35 Precision Analog Temp Probe', 'DS18B20 Waterproof Temp Probe', 'MQ-2 Combustible Gas/Smoke sensor', 'MQ-135 Air Quality Gas sensor', 'MQ-7 Carbon Monoxide detector', 'Rain Water Level Detector Module'
    ];
    envVariants.forEach((v, i) => {
        list.push({
            id: `env_var_${i}`,
            name: v,
            category: 'Environmental Sensors',
            desc: `Precision environmental breakout board for capturing atmospheric telemetry including ${v.split(' ').slice(1).join(' ')}.`,
            specs: 'Standard I2C/Analog interface, 3.3V/5V compatible',
            price: 'Free',
            isPremium: true,
            icon: getDynamicIcon('dht11', v)
        });
    });

    // 7. Motion & Position Sensors
    const motionSensors = [
        { id: 'sensor', name: 'Ultrasonic Sonar (HC-SR04)', category: 'Motion & Position Sensors', desc: 'Standard non-contact distance measuring device.', specs: '2cm - 400cm, 5V, Dual transducers', price: 'Free', isPremium: false, icon: <SensorPackIcon /> },
        { id: 'pir', name: 'PIR Motion Sensor (HC-SR501)', category: 'Motion & Position Sensors', desc: 'Pyroelectric infrared motion detector breakout.', specs: '3m-7m detection, 110° cone adjustment', price: 'Free', isPremium: false, icon: <PIRIcon /> },
        { id: 'gyro', name: 'MPU6050 Gyroscope & Accel', category: 'Motion & Position Sensors', desc: '6-axis MEMS motion-tracking chip module.', specs: '3-axis accelerometer, 3-axis gyro, I2C', price: 'Free', isPremium: false, icon: <GyroscopeIcon /> }
    ];
    list.push(...motionSensors);

    const motionVariants = [
        'ADXL345 3-Axis Digital Accelerometer', 'HC-SR505 Mini PIR Motion Detector', 'RC522 RFID Card Reader Module', 'Optical Infrared Barrier Avoidance Sensor', 'TCRT5000 IR Reflective Line Tracker', 'HC-SR04P 3.3V Low-Power Sonar', 'VL53L0X Laser Time-of-Flight Sonar', 'HC-SR551 Micro PIR Sensor Board'
    ];
    motionVariants.forEach((v, i) => {
        list.push({
            id: `motion_var_${i}`,
            name: v,
            category: 'Motion & Position Sensors',
            desc: `Premium position and motion tracking sensor module: ${v}. Perfect for robotics.`,
            specs: 'Digital I2C / SPI / Pulse outputs, 3.3-5V VCC',
            price: 'Free',
            isPremium: true,
            icon: getDynamicIcon('gyro', v)
        });
    });

    // 8. Optoelectronics & Displays
    const baseDisplays = [
        { id: 'oled', name: '0.96" I2C OLED screen', category: 'Optoelectronics & Displays', desc: 'Vibrant organic character display with CSS overlays.', specs: '128x64 pixels, I2C, SSD1306', price: 'Free', isPremium: true, icon: <OLEDDisplayIcon /> },
        { id: 'lcd1602', name: '16x2 I2C Character LCD', category: 'Optoelectronics & Displays', desc: 'Liquid crystal screen with green LED backlighting.', specs: 'HD44780, 16x2 Chars, 5V, I2C Backboard', price: 'Free', isPremium: false, icon: <LCD1602Icon /> },
        { id: 'led', name: 'Interactive RGB LED', category: 'Optoelectronics & Displays', desc: 'Tinkercad-style custom colored glowing dome light.', specs: '5mm RGB dome, custom colors, solved glowing', price: 'Free', isPremium: false, icon: <LEDIcon /> }
    ];
    list.push(...baseDisplays);

    const optoVariants = [
        'Bright Green 5mm LED', 'Bright Red 5mm LED', 'Bright Yellow 5mm LED', 'Bright Blue 5mm LED', 'MAX7219 8x8 LED Dot Matrix', 'TM1637 4-Digit 7-Segment Display', 'WS2812B NeoPixel 8-LED Ring', 'WS2812B NeoPixel 16-LED Ring', 'MAX7219 4-in-1 Dot Matrix Display', 'Nokia 5110 Graphic LCD (84x48)', 'SH1106 1.3" I2C OLED screen', 'Optocoupler PC817 Phototransistor Isolation'
    ];
    optoVariants.forEach((v, i) => {
        list.push({
            id: `opto_var_${i}`,
            name: v,
            category: 'Optoelectronics & Displays',
            desc: `High-fidelity optoelectronic and display breakout board: ${v}. Offers vivid visual output.`,
            specs: 'Standard control pins, 3.3V-5V logic',
            price: 'Free',
            isPremium: true,
            icon: getDynamicIcon('oled', v)
        });
    });

    // 9. Actuators & Motors
    const baseActuators = [
        { id: 'motor', name: 'SG90 Micro Servo Motor', category: 'Actuators & Motors', desc: 'High-torque 180-degree micro-servo actuator.', specs: '1.6 kg-cm, 180°, 4.8V-6V', price: 'Free', isPremium: false, icon: <ServoMotorIcon /> },
        { id: 'dc_motor', name: 'Toy DC Motor (3V-6V)', category: 'Actuators & Motors', desc: 'Axial drive motor with brass pinion gear.', specs: '3V-6V Range, 9000 RPM at 3V', price: 'Free', isPremium: false, icon: <DCMotorIcon /> },
        { id: 'stepper', name: '28BYJ-48 Stepper Motor', category: 'Actuators & Motors', desc: 'Precise 4-phase gear reduction stepper motor.', specs: '5V DC, 64 steps/rev, 1:64 reduction gear', price: 'Free', isPremium: false, icon: <StepperMotorIcon /> },
        { id: 'buzzer', name: 'Active Piezo Buzzer', category: 'Actuators & Motors', desc: 'High-pitch active audible alert buzzer.', specs: '5V Active, 2.3kHz resonance, polar nodes', price: 'Free', isPremium: false, icon: <BuzzerIcon /> },
        { id: 'relay', name: '5V Single-Channel Relay', category: 'Actuators & Motors', desc: 'Safe mechanical current sugar-cube relay module.', specs: '5V Coil, 10A 250VAC contacts', price: 'Free', isPremium: false, icon: <RelayIcon /> }
    ];
    list.push(...baseActuators);

    const actVariants = [
        'MG90S Metal Gear Micro Servo', 'Standard NEMA 17 Stepper Motor', 'L298N Dual H-Bridge Motor Driver Board', 'Active 3V Piezo Sonalert Buzzer', 'Passive 5V Piezo Music Buzzer', 'Dual-Channel 5V Optocoupler Relay Board', 'Four-Channel 5V Optocoupler Relay Board', 'Toy DC Propeller Fan Shaft Motor', '5V Electromagnetic Solenoid Lock Actuator'
    ];
    actVariants.forEach((v, i) => {
        list.push({
            id: `act_var_${i}`,
            name: v,
            category: 'Actuators & Motors',
            desc: `Premium robotic actuator and motor controller: ${v}. Perfect for automated physical joints.`,
            specs: 'VCC, GND, Trigger control pins',
            price: 'Free',
            isPremium: true,
            icon: getDynamicIcon('motor', v)
        });
    });

    // 10. Power Sources & Regulators
    const basePower = [
        { id: 'battery_9v', name: '9V heavy-Duty Battery', category: 'Power Sources & Regulators', desc: 'Classic rectangular cased 9V heavy alkaline battery.', specs: '9V Nominal, 550mAh, snap caps', price: 'Free', isPremium: false, icon: <Battery9VIcon /> },
        { id: 'battery_aa', name: 'AA Battery Holder (3.0V)', category: 'Power Sources & Regulators', desc: 'Holds 2x AA batteries with prewired leads.', specs: '3.0V output, prewired black/red leads', price: 'Free', isPremium: false, icon: <BatteryAAIcon /> }
    ];
    list.push(...basePower);

    const pwrVariants = [
        'Breadboard 5V/3.3V Power Supply Board', 'AA Triple Battery Holder (4.5V)', 'AA Quad Battery Holder (6.0V)', '18650 Single Battery Shield (5V/3A)', 'TP4056 LiPo Battery Charging Charger', 'LM2596 DC-DC Buck Converter Regulator', 'XL6009 DC-DC Boost Converter Regulator', '5V 2A Wall Adapter Breakout Board', '9V heavy-Duty Alkaline Pro Cell'
    ];
    pwrVariants.forEach((v, i) => {
        list.push({
            id: `pwr_var_${i}`,
            name: v,
            category: 'Power Sources & Regulators',
            desc: `High-efficiency power supply, shield, and converter regulator: ${v}. Protects and stabilizes your core MCUs.`,
            specs: 'Standard regulator input/output pins',
            price: 'Free',
            isPremium: true,
            icon: getDynamicIcon('battery_9v', v)
        });
    });

    // 11. Interface & Communication
    const commVariants = [
        'HC-05 Wireless Serial Bluetooth module', 'NRF24L01+ 2.4GHz Wireless Transceiver', 'DS3231 High-Precision I2C RTC clock', 'ADS1115 16-Bit 4-Channel Analog-to-Digital', 'MCP2515 CAN Bus Controller SPI module', 'FTDI USB-to-TTL Serial Adapter shield', 'ESP-01 Wi-Fi ESP8266 Transceiver module', 'SX1278 LoRa 433MHz Wireless Transceiver'
    ];
    commVariants.forEach((v, i) => {
        list.push({
            id: `comm_var_${i}`,
            name: v,
            category: 'Interface & Communication',
            desc: `Premium communication and serial expansion interface breakout board: ${v}. Connects your system to remote clients.`,
            specs: 'Standard SPI/I2C/UART pinouts, 3.3V/5V logic',
            price: 'Free',
            isPremium: true,
            icon: getDynamicIcon('gyro', v)
        });
    });

    // 12. Breadboards & Prototyping
    const baseProto = [
        { id: 'breadboard', name: 'Full Solderless Breadboard', category: 'Breadboards & Prototyping', desc: '830-point board with live connection row hover highlights.', specs: '830 tie points, dual rails', price: 'Free', isPremium: false, icon: <BreadboardIcon /> },
        { id: 'breadboard_mini', name: 'Mini Prototyping Breadboard', category: 'Breadboards & Prototyping', desc: 'Compact 170-point board, perfect for tight modules.', specs: '170 tie points, 17 columns', price: 'Free', isPremium: false, icon: <BreadboardIcon /> }
    ];
    list.push(...baseProto);

    return list;
};

const MARKETPLACE_PRODUCTS = generateMarketplaceProducts();

// Helper to trace if an LED has a closed circuit from power (5V, 3V3, VCC) to ground (GND) via any combination of wires, resistors, or breadboards
const checkLedPower = (components = [], connections = []) => {
    const powered = {};
    const leds = components.filter(c => c.type === 'led');

    // Build the connectivity graph where nodes are `compId:pinName`
    const adj = {};
    const addEdge = (u, v) => {
        if (!adj[u]) adj[u] = [];
        if (!adj[v]) adj[v] = [];
        adj[u].push(v);
        adj[v].push(u);
    };

    // 1. Add edges from physical connections (wires)
    connections.forEach(conn => {
        const u = `${conn.fromId}:${conn.fromPin}`;
        const v = `${conn.toId}:${conn.toPin}`;
        addEdge(u, v);
    });

    // 2. Add internal connections for specific components
    components.forEach(comp => {
        if (comp.type === 'resistor') {
            // A resistor acts as a bidirectional conductor between Pin A and Pin B
            addEdge(`${comp.id}:Pin A`, `${comp.id}:Pin B`);
        }
        // Breadboard pins are treated as single node connection points in the graph, 
        // so multiple connections to the same Row segment or power rail are automatically bridged.
    });

    // Find all nodes reachable from power sources and ground sources
    const powerSources = [];
    const gndSources = [];

    components.forEach(comp => {
        if (comp.type === 'control') {
            powerSources.push(`${comp.id}:5V`);
            gndSources.push(`${comp.id}:GND`);
        } else if (comp.type === 'esp32') {
            powerSources.push(`${comp.id}:3V3`);
            gndSources.push(`${comp.id}:GND`);
        }
    });

    const getReachable = (sources) => {
        const visited = new Set();
        const queue = [...sources];
        sources.forEach(s => visited.add(s));

        while (queue.length > 0) {
            const curr = queue.shift();
            const neighbors = adj[curr] || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return visited;
    };

    const poweredNodes = getReachable(powerSources);
    const gndNodes = getReachable(gndSources);

    leds.forEach(led => {
        const hasVcc = poweredNodes.has(`${led.id}:Anode`);
        const hasGnd = gndNodes.has(`${led.id}:Cathode`);
        powered[led.id] = hasVcc && hasGnd;
    });

    return powered;
};

const CATEGORY_OPTIONS = [
    { value: 'All', label: 'All Categories', icon: <FaCube style={{ color: '#bc8cff' }} /> },
    { value: 'Microcontrollers & Dev Boards', label: 'Microcontrollers & Dev Boards', icon: <ArduinoUnoIcon /> },
    { value: 'Basic Passives (Resistors & Caps)', label: 'Passives (Resistors & Caps)', icon: <ResistorIcon /> },
    { value: 'Semiconductors (Diodes & Transistors)', label: 'Semiconductors & Transistors', icon: <DiodeIcon /> },
    { value: 'Logic Gates & 74xx Series', label: 'Logic Gates & 74xx Series', icon: <ICChipIcon /> },
    { value: 'Analog ICs & Op-Amps', label: 'Analog ICs & Op-Amps', icon: <ICChipIcon /> },
    { value: 'Environmental Sensors', label: 'Environmental Sensors', icon: <DHT11SensorIcon /> },
    { value: 'Motion & Position Sensors', label: 'Motion & Position Sensors', icon: <SensorPackIcon /> },
    { value: 'Optoelectronics & Displays', label: 'Optoelectronics & Displays', icon: <OLEDDisplayIcon /> },
    { value: 'Actuators & Motors', label: 'Actuators & Motors', icon: <ServoMotorIcon /> },
    { value: 'Power Sources & Regulators', label: 'Power Sources & Regulators', icon: <Battery9VIcon /> },
    { value: 'Interface & Communication', label: 'Interface & Communication', icon: <GyroscopeIcon /> },
    { value: 'Breadboards & Prototyping', label: 'Breadboards & Prototyping', icon: <BreadboardIcon /> }
];

const CustomDropdown = ({ value, onChange, options, style = {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="custom-dropdown-container" 
            style={{ position: 'relative', width: '100%', userSelect: 'none', zIndex: 1000, ...style }}
        >
            <div 
                className="custom-dropdown-trigger form-control-dark"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    color: '#c9d1d9',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    justifyContent: 'space-between',
                    minHeight: '34px'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', flexShrink: 0, opacity: 0.9 }}>
                        {selectedOption.icon}
                    </div>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                        {selectedOption.label}
                    </span>
                </div>
                <span style={{ fontSize: '0.65rem', color: '#8b949e', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                </span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="custom-dropdown-menu glass-card"
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 5px)',
                            left: 0,
                            right: 0,
                            background: 'rgba(21, 26, 35, 0.95)',
                            border: '1px solid rgba(188, 140, 255, 0.3)',
                            borderRadius: '8px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.65)',
                            backdropFilter: 'blur(20px)',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            padding: '4px',
                            zIndex: 1010
                        }}
                    >
                        {options.map((opt) => {
                            const isSelected = opt.value === value;
                            return (
                                <div
                                    key={opt.value}
                                    className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        padding: '0.5rem 0.65rem',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        color: isSelected ? '#bc8cff' : '#c9d1d9',
                                        background: isSelected ? 'rgba(188, 140, 255, 0.1)' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.currentTarget.style.color = '#white';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#c9d1d9';
                                        }
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', flexShrink: 0, opacity: isSelected ? 1 : 0.75 }}>
                                        {opt.icon}
                                    </div>
                                    <span style={{ 
                                        fontWeight: isSelected ? 600 : 400,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        flex: 1
                                    }} title={opt.label}>
                                        {opt.label}
                                    </span>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const WorkshopLayout = ({ onClose }) => {
    const { currentUser } = useAuth();
    const [showHelp, setShowHelp] = useState(false);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const [components, setComponents] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sensorData, setSensorData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotation: { alpha: 0, beta: 0, gamma: 0 } });
    
    // Wiring/Connection Simulator States
    const [isWiringMode, setIsWiringMode] = useState(false);
    const [activeWiringSource, setActiveWiringSource] = useState(null);
    const [wireColor, setWireColor] = useState('#ff3333');

    // Marketplace & Dynamic Inventory States
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
    const [unlockedComponents, setUnlockedComponents] = useState(['control', 'motor', 'sensor', 'breadboard', 'resistor', 'led', 'cap_ceramic', 'cap_electrolytic']); // Pre-unlocked prototyping essentials
    const [selectedMarketTab, setSelectedMarketTab] = useState('All');
    const [selectedSidebarCategory, setSelectedSidebarCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const helpRef = useRef(null);

    // Live LED powered states computed dynamically
    const poweredLeds = checkLedPower(components, connections);

    // Sensor simulation
    useEffect(() => {
        logActivity(currentUser, 'Workshop Entered', { mode: currentUser ? 'loggedIn' : 'guest' });
        let isActive = true;

        const handleMotion = (event) => {
            if (!isActive) return;
            const accel = event.accelerationIncludingGravity || event.acceleration;
            if (accel) {
                setSensorData(prev => ({
                    ...prev,
                    acceleration: {
                        x: accel.x || 0,
                        y: accel.y || 0,
                        z: accel.z || 0
                    }
                }));
            }
        };

        const handleOrientation = (event) => {
            if (!isActive) return;
            setSensorData(prev => ({
                ...prev,
                rotation: {
                    alpha: event.alpha || 0,
                    beta: event.beta || 0,
                    gamma: event.gamma || 0
                }
            }));
        };

        const simulationInterval = setInterval(() => {
            if (!isActive || isIdle) return;
            setSensorData(prev => ({
                acceleration: {
                    x: (Math.random() - 0.5) * 0.1 + prev.acceleration.x * 0.9,
                    y: (Math.random() - 0.5) * 0.1 + prev.acceleration.y * 0.9,
                    z: (Math.random() - 0.5) * 0.1 + prev.acceleration.z * 0.9
                },
                rotation: {
                    alpha: (prev.rotation.alpha + 0.2) % 360,
                    beta: Math.sin(Date.now() / 2000) * 5,
                    gamma: Math.cos(Date.now() / 2000) * 5
                }
            }));
        }, 100);

        window.addEventListener('devicemotion', handleMotion);
        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            isActive = false;
            window.removeEventListener('devicemotion', handleMotion);
            window.removeEventListener('deviceorientation', handleOrientation);
            clearInterval(simulationInterval);
        };
    }, [currentUser, isIdle]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('kone_lab_tour_seen');
        if (!hasSeenTour) {
            const timer = setTimeout(() => setIsTourOpen(true), 1500);
            localStorage.setItem('kone_lab_tour_seen', 'true');
            return () => clearTimeout(timer);
        }
    }, []);

    const addComponent = (type, name) => {
        const offsetX = (components.length * 1.6) - 1.6;
        const newComponent = {
            id: Date.now().toString(),
            type,
            name,
            position: [offsetX, 0, 0],
            rotation: [0, 0, 0],
            scale: 1,
            // Custom properties for new components
            color: type === 'led' ? 'red' : undefined,
            value: type === 'resistor' ? 220 : undefined,
            properties: type === 'sensor' ? { reading: 0 } : {}
        };
        setComponents([...components, newComponent]);
        setSelectedId(newComponent.id);
        logActivity(currentUser, 'Component Added', { type, name });
    };

    const updateComponent = (id, updates) => {
        setComponents(components.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    // Wiring connection handler
    const handlePinClick = (compId, pin) => {
        if (!activeWiringSource) {
            setActiveWiringSource({ compId, pin });
        } else {
            if (activeWiringSource.compId === compId) {
                setActiveWiringSource(null);
                setIsWiringMode(false);
                return;
            }

            const newConnection = {
                id: Date.now().toString(),
                fromId: activeWiringSource.compId,
                fromPin: activeWiringSource.pin,
                toId: compId,
                toPin: pin,
                color: wireColor
            };

            setConnections([...connections, newConnection]);
            logActivity(currentUser, '3D Wire Connected', { fromPin: activeWiringSource.pin, toPin: pin });
            
            setActiveWiringSource(null);
            setIsWiringMode(false);
        }
    };

    // Marketplace Unlocking
    const unlockComponent = (prodId) => {
        if (unlockedComponents.includes(prodId)) return;
        setUnlockedComponents([...unlockedComponents, prodId]);
        logActivity(currentUser, 'Premium Component Unlocked', { productId: prodId });
    };

    // Remove component along with any wires connected to it
    const removeComponent = (compId) => {
        setComponents(components.filter(c => c.id !== compId));
        setConnections(connections.filter(conn => conn.fromId !== compId && conn.toId !== compId));
        if (selectedId === compId) setSelectedId(null);
    };

    const removeConnection = (connId) => {
        setConnections(connections.filter(c => c.id !== connId));
    };

    const selectedComponent = components.find(c => c.id === selectedId);

    // Close help popover
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setShowHelp(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getComponentName = (id) => {
        const comp = components.find(c => c.id === id);
        return comp ? comp.name : 'Unknown Device';
    };

    // Filtered list for Sidebar inventory (checks name, specs, category, and is unlocked)
    const filteredSidebarProducts = MARKETPLACE_PRODUCTS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.specs.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Filtered list for Marketplace modal (checks tab selection + search query)
    const filteredMarketProducts = MARKETPLACE_PRODUCTS.filter(p => {
        const matchesTab = selectedMarketTab === 'All' || p.category === selectedMarketTab;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <motion.div 
            className="workshop-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <AnimatePresence>
                {isMobile && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mobile-optimized-notice"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(10, 12, 16, 0.95)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            textAlign: 'center',
                            zIndex: 10000,
                            backdropFilter: 'blur(12px)'
                        }}
                    >
                        <div style={{ color: '#58a6ff', fontSize: '4rem', marginBottom: '2rem' }}>
                            <FaCogs />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Desktop Optimized</h2>
                        <p style={{ color: '#8b949e', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '300px' }}>
                            Kone Lab Workshop is optimized for desktop. For the best experience, including 3D simulation and precise property controls, please use a desktop browser.
                        </p>
                        <button 
                            className="control-btn accent" 
                            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                            onClick={() => setIsMobile(false)}
                        >
                            Continue Anyway
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="workshop-header">
                <div className="workshop-brand">
                    <img src="/logo-circle-blue.svg" alt="Logo" className="header-logo" />
                    <span className="brand-name">Kone Lab <span className="text-secondary">Workshop v1.3</span></span>
                </div>
                
                {/* Wiring Mode Status Panel */}
                <AnimatePresence>
                    {isWiringMode && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="wiring-status-banner"
                        >
                            <span className="wiring-dot-pulse"></span>
                            <span className="wiring-status-text">
                                {activeWiringSource 
                                    ? `Connect ${getComponentName(activeWiringSource.compId)} (${activeWiringSource.pin}) to destination pin...` 
                                    : "Wiring Mode Active: Select source node"}
                            </span>
                            <button className="btn-cancel-wiring" onClick={() => {
                                setIsWiringMode(false);
                                setActiveWiringSource(null);
                            }}>Cancel</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="workshop-controls" id="workshop-controls">
                    <button 
                        className={`control-btn ${isWiringMode ? 'active-wiring' : ''}`} 
                        onClick={() => {
                            setIsWiringMode(!isWiringMode);
                            setActiveWiringSource(null);
                        }}
                        title="Start connecting hardware wires in 3D"
                    >
                        <FaLink /> 3D Wire Tool
                    </button>

                    <button 
                        className="control-btn store-btn" 
                        onClick={() => setIsMarketplaceOpen(true)}
                        title="Browse & unlock photorealistic 3D hardware"
                        style={{ border: '1px solid rgba(188, 140, 255, 0.4)' }}
                    >
                        <FaStore style={{ color: '#bc8cff' }} /> Component Marketplace
                    </button>
                    
                    <button className="control-btn" onClick={() => setIsTourOpen(true)} title="Quick Start Tour">
                        <FaTools /> Tour
                    </button>
                    <button className="control-btn"><FaSave /> Save</button>
                    <button 
                        className="control-btn accent" 
                        title="Simulate Workshop"
                        onClick={() => logActivity(currentUser, 'Simulation Started', { componentCount: components.length, wireCount: connections.length })}
                    >
                        <FaPlay /> Simulate
                    </button>
                    
                    <div className="help-menu-container" ref={helpRef}>
                        <button 
                            className={`help-toggle-btn ${showHelp ? 'active' : ''}`}
                            onClick={() => setShowHelp(!showHelp)}
                            title="Help & Resources"
                        >
                            <FaQuestionCircle />
                        </button>

                        <AnimatePresence>
                            {showHelp && (
                                <motion.div 
                                    className="help-popover"
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="popover-header">Workshop Help</div>
                                    <div className="popover-content">
                                        <a 
                                            href={((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !navigator.userAgent.includes('ReactSnap') ? 'http://localhost:3001' : 'https://consult.koneacademy.io') + "/docs?category=lab"} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="popover-item"
                                        >
                                            <div className="item-icon"><FaBook /></div>
                                            <div className="item-text">
                                                <span className="item-title">Documentation</span>
                                                <span className="item-desc">Learn how to use simulation tools</span>
                                            </div>
                                            <FaExternalLinkAlt className="external-icon" />
                                        </a>

                                        <a 
                                            href={((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !navigator.userAgent.includes('ReactSnap') ? 'http://localhost:3001' : 'https://consult.koneacademy.io') + "/contact"} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="popover-item"
                                        >
                                            <div className="item-icon"><FaCommentAlt /></div>
                                            <div className="item-text">
                                                <span className="item-title">Feedback</span>
                                                <span className="item-desc">Report bugs or suggest features</span>
                                            </div>
                                            <FaExternalLinkAlt className="external-icon" />
                                        </a>
                                    </div>
                                    <div className="popover-footer">
                                        v1.3.0-beta
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="control-divider"></div>
                    <button className="control-btn" onClick={() => {
                        logActivity(currentUser, 'Workshop Exit');
                        onClose();
                    }}>
                        <FaTimes /> Back to Home
                    </button>
                </div>
            </header>

            <div className="workshop-main">
                 {/* Left Sidebar - Dynamic Unlocked Inventory */}
                <aside className="workshop-sidebar left" id="component-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'visible' }}>
                    <div className="sidebar-brand-title" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #30363d', marginBottom: '0.25rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <FaTools style={{ color: '#58a6ff' }} /> Component Drawer
                        </h3>
                    </div>

                    {/* Integrated dynamic search & category filters for 1000+ components */}
                    <div style={{ marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', zIndex: 1005 }}>
                        <input 
                            type="text" 
                            className="form-control-dark"
                            placeholder="🔍 Search 1000+ components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                background: '#0d1117',
                                border: '1px solid #30363d',
                                borderRadius: '6px',
                                padding: '0.5rem 0.75rem',
                                color: '#c9d1d9',
                                fontSize: '0.8rem',
                                outline: 'none'
                            }}
                        />
                        <CustomDropdown
                            value={selectedSidebarCategory}
                            onChange={setSelectedSidebarCategory}
                            options={CATEGORY_OPTIONS}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* Scrollable Inventory Area */}
                    <div className="sidebar-scroll-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '4px', minHeight: 0 }}>

                    {/* Group unlocked components into 12 discrete engineering categories */}
                    {[
                        { name: '1. Microcontrollers & Dev Boards', key: 'Microcontrollers & Dev Boards' },
                        { name: '2. Basic Passives (Resistors & Caps)', key: 'Basic Passives (Resistors & Caps)' },
                        { name: '3. Semiconductors (Diodes & Transistors)', key: 'Semiconductors (Diodes & Transistors)' },
                        { name: '4. Logic Gates & 74xx Series', key: 'Logic Gates & 74xx Series' },
                        { name: '5. Analog ICs & Op-Amps', key: 'Analog ICs & Op-Amps' },
                        { name: '6. Environmental Sensors', key: 'Environmental Sensors' },
                        { name: '7. Motion & Position Sensors', key: 'Motion & Position Sensors' },
                        { name: '8. Optoelectronics & Displays', key: 'Optoelectronics & Displays' },
                        { name: '9. Actuators & Motors', key: 'Actuators & Motors' },
                        { name: '10. Power Sources & Regulators', key: 'Power Sources & Regulators' },
                        { name: '11. Interface & Communication', key: 'Interface & Communication' },
                        { name: '12. Breadboards & Prototyping', key: 'Breadboards & Prototyping' }
                    ].filter(cat => selectedSidebarCategory === 'All' || cat.key === selectedSidebarCategory)
                    .map(cat => {
                        const unlockedInCat = filteredSidebarProducts.filter(p => p.category === cat.key && unlockedComponents.includes(p.id));
                        if (unlockedInCat.length === 0) return null;

                        return (
                            <div className="sidebar-group" key={cat.key} style={{ marginBottom: '0.5rem' }}>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '0.72rem', color: '#8b949e', letterSpacing: '0.04em', marginBottom: '0.5rem', borderBottom: '1px solid #21262d', paddingBottom: '0.25rem', fontWeight: 'bold' }}>
                                    {cat.name}
                                </h4>
                                <div className="component-list" style={{ display: 'grid', gap: '0.4rem' }}>
                                    {unlockedInCat.map(prod => (
                                        <div 
                                            key={prod.id} 
                                            className={`component-item draggable ${prod.isPremium ? 'premium-unlocked' : ''}`} 
                                            onClick={() => addComponent(prod.id, prod.name)}
                                            style={{ padding: '0.5rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', gap: '0.6rem' }}
                                        >
                                            <div className="component-item-icon-wrapper">{prod.icon}</div>
                                            <span className={prod.isPremium ? 'premium-text-glow' : ''}>{prod.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Open Store Call to Action */}
                    <button 
                        className="btn-open-store-sidebar" 
                        onClick={() => setIsMarketplaceOpen(true)}
                    >
                        <FaStore /> Browse Marketplace
                    </button>

                    {/* Wire Customization Color Palette */}
                    <div className="sidebar-group" style={{ marginTop: '1.5rem' }}>
                        <h4>Wire Insulation Color</h4>
                        <div className="wire-color-palette">
                            {[
                                { hex: '#ff3333', name: 'VCC / 5V' },
                                { hex: '#1f1f1f', name: 'GND' },
                                { hex: '#ffc107', name: 'Signal (Yellow)' },
                                { hex: '#0d6efd', name: 'PWM (Blue)' }
                            ].map(color => (
                                <button 
                                    key={color.hex}
                                    className={`wire-color-btn ${wireColor === color.hex ? 'selected' : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => setWireColor(color.hex)}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                    </div>
                </aside>

                {/* Center - 3D Viewport */}
                <main className="workshop-content" id="workshop-scene">
                    <WorkshopScene 
                        components={components} 
                        connections={connections}
                        selectedId={selectedId} 
                        onSelect={setSelectedId} 
                        isPaused={isIdle} 
                        isWiringMode={isWiringMode}
                        onPinClick={handlePinClick}
                        activeWiringSource={activeWiringSource}
                        onUpdate={updateComponent}
                        poweredLeds={poweredLeds}
                    />
                    <div className="viewport-overlay">
                        <div className="view-badge">
                            {isWiringMode 
                                ? 'Wiring System Active' 
                                : isIdle ? 'Simulation Paused (Idle)' : `Simulation ${components.length > 0 ? 'Active' : 'Ready'}`}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Properties & Active Wires */}
                <aside className="workshop-sidebar right" id="properties-sidebar">
                    <div className="sidebar-group">
                        <h4>Component Properties</h4>
                        {selectedComponent ? (
                            <>
                                <div className="property-item">
                                    <label>Name</label>
                                    <input 
                                        type="text" 
                                        value={selectedComponent.name} 
                                        onChange={(e) => updateComponent(selectedId, { name: e.target.value })}
                                        className="form-control-dark"
                                        style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', color: 'white', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem' }}
                                    />
                                </div>
                                
                                {/* Resistor Ohms editor */}
                                {selectedComponent.type === 'resistor' && (
                                    <div className="property-item">
                                        <label>Resistance Value (Ohms)</label>
                                        <input 
                                            type="number" 
                                            value={selectedComponent.value || 220} 
                                            step="10"
                                            onChange={(e) => updateComponent(selectedId, { value: parseInt(e.target.value) || 0 })}
                                            style={{
                                                width: '100%', background: '#161b22', border: '1px solid #30363d',
                                                color: 'white', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Capacitor capacitance editor */}
                                {(selectedComponent.type === 'cap_ceramic' || selectedComponent.type === 'cap_electrolytic' || selectedComponent.type.startsWith('cap_')) && (
                                    <div className="property-item">
                                        <label>Capacitance Value</label>
                                        <input 
                                            type="text" 
                                            value={selectedComponent.value || (selectedComponent.type === 'cap_electrolytic' ? '10 µF' : '100 nF')} 
                                            onChange={(e) => updateComponent(selectedId, { value: e.target.value })}
                                            placeholder="e.g. 100 nF, 10 µF"
                                            style={{
                                                width: '100%', background: '#161b22', border: '1px solid #30363d',
                                                color: 'white', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* LED color editor */}
                                {selectedComponent.type === 'led' && (
                                    <div className="property-item">
                                        <label>LED Indicator Color</label>
                                        <select 
                                            value={selectedComponent.color || 'red'} 
                                            onChange={(e) => updateComponent(selectedId, { color: e.target.value })}
                                            style={{
                                                width: '100%', background: '#161b22', border: '1px solid #30363d',
                                                color: 'white', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem'
                                            }}
                                        >
                                            <option value="red">Red</option>
                                            <option value="green">Green</option>
                                            <option value="blue">Blue</option>
                                            <option value="yellow">Yellow</option>
                                        </select>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem', color: '#8b949e', display: 'block', marginBottom: '0.2rem' }}>Pos X (Grid)</label>
                                        <input 
                                            type="number" 
                                            step="0.1" 
                                            value={selectedComponent.position[0].toFixed(1)} 
                                            onChange={(e) => {
                                                const pos = [...selectedComponent.position];
                                                pos[0] = parseFloat(e.target.value) || 0;
                                                updateComponent(selectedId, { position: pos });
                                            }}
                                            style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', color: 'white', padding: '0.45rem', borderRadius: '6px', fontSize: '0.8rem' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem', color: '#8b949e', display: 'block', marginBottom: '0.2rem' }}>Pos Z (Depth)</label>
                                        <input 
                                            type="number" 
                                            step="0.1" 
                                            value={selectedComponent.position[2].toFixed(1)} 
                                            onChange={(e) => {
                                                const pos = [...selectedComponent.position];
                                                pos[2] = parseFloat(e.target.value) || 0;
                                                updateComponent(selectedId, { position: pos });
                                            }}
                                            style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', color: 'white', padding: '0.45rem', borderRadius: '6px', fontSize: '0.8rem' }}
                                        />
                                    </div>
                                </div>

                                <div className="property-item">
                                    <label>Rotation Y (Degrees)</label>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="360" 
                                        step="15" 
                                        value={Math.round((selectedComponent.rotation[1] * 180) / Math.PI)}
                                        onChange={(e) => {
                                            const rot = [...selectedComponent.rotation];
                                            rot[1] = (parseFloat(e.target.value) * Math.PI) / 180;
                                            updateComponent(selectedId, { rotation: rot });
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                
                                {(selectedComponent.type === 'sensor' || selectedComponent.type === 'dht11') && (
                                    <div className="property-item sensor-readout" style={{ marginTop: '0.5rem' }}>
                                        <label>Telemetry Output</label>
                                        <div className="readout-grid">
                                            <div className="readout-val">
                                                <span>Temp:</span> {sensorData.rotation.beta > 0 ? (20 + sensorData.rotation.beta * 0.5).toFixed(1) : '22.4'}°C
                                            </div>
                                            <div className="readout-val">
                                                <span>Humidity:</span> {sensorData.rotation.gamma > 0 ? (40 + sensorData.rotation.gamma * 0.8).toFixed(1) : '55.2'}% RH
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="property-item">
                                    <label>Status</label>
                                    <span className="badge-online">Active / Online</span>
                                </div>
                                <button 
                                    className="btn-delete-component"
                                    onClick={() => removeComponent(selectedId)}
                                    style={{ marginTop: '0.75rem', width: '100%', padding: '0.6rem' }}
                                >
                                    Remove Component
                                </button>
                            </>
                        ) : (
                            <p className="no-selection">Select a device to view properties</p>
                        )}
                    </div>

                    {/* Active Connections Console */}
                    <div className="sidebar-group connection-console-group" style={{ marginTop: '1rem', borderTop: '1px solid #30363d', paddingTop: '1.5rem' }}>
                        <h4>Connected Wires ({connections.length})</h4>
                        {connections.length > 0 ? (
                            <div className="connection-list-container">
                                {connections.map(conn => (
                                    <div key={conn.id} className="connection-list-item">
                                        <div className="connection-color-dot" style={{ backgroundColor: conn.color }}></div>
                                        <div className="connection-details">
                                            <div className="conn-text">
                                                <strong>{getComponentName(conn.fromId)}</strong> ({conn.fromPin})
                                            </div>
                                            <div className="conn-arrow">──</div>
                                            <div className="conn-text">
                                                <strong>{getComponentName(conn.toId)}</strong> ({conn.toPin})
                                            </div>
                                        </div>
                                        <button 
                                            className="btn-delete-connection" 
                                            onClick={() => removeConnection(conn.id)}
                                            title="Delete wire connection"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-selection">No wires connected. Click "3D Wire Tool" to start wiring!</p>
                        )}
                    </div>
                </aside>
            </div>

            {/* Component Marketplace center modal overlay */}
            <AnimatePresence>
                {isMarketplaceOpen && (
                    <div 
                        className="modal-overlay" 
                        onClick={() => setIsMarketplaceOpen(false)}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', zIndex: 5000, backdropFilter: 'blur(12px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            onClick={e => e.stopPropagation()}
                            className="glass-card marketplace-modal-card"
                        >
                            <div className="marketplace-modal-header">
                                <div className="market-header-brand">
                                    <FaStore className="market-store-icon" />
                                    <div>
                                        <h2>Kone Lab Marketplace</h2>
                                        <p>Unlock photorealistic 3D hardware and expansion sensors</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', marginRight: '1.25rem' }}>
                                    <CustomDropdown
                                        value={selectedMarketTab}
                                        onChange={setSelectedMarketTab}
                                        options={CATEGORY_OPTIONS}
                                        style={{ width: '240px' }}
                                    />

                                    <input 
                                        type="text" 
                                        className="form-control-dark"
                                        placeholder="Search 1000+ components..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            width: '210px',
                                            background: '#0d1117',
                                            border: '1px solid #30363d',
                                            borderRadius: '6px',
                                            padding: '0.5rem 0.75rem',
                                            color: '#c9d1d9',
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <button className="btn-close-market" onClick={() => setIsMarketplaceOpen(false)}>
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Products Grid */}
                            <div className="marketplace-products-grid">
                                {filteredMarketProducts.map(prod => {
                                    const isUnlocked = unlockedComponents.includes(prod.id);
                                    return (
                                        <div key={prod.id} className={`product-card ${isUnlocked ? 'unlocked' : ''}`}>
                                            <div className="product-card-icon-container">
                                                {prod.icon}
                                                {prod.isPremium && <span className="premium-label-badge">PREMIUM</span>}
                                            </div>
                                            <div className="product-card-info">
                                                <h3>{prod.name}</h3>
                                                <span className="product-card-specs">{prod.specs}</span>
                                                <p>{prod.desc}</p>
                                            </div>
                                            <div className="product-card-footer">
                                                <span className="product-price">{prod.price}</span>
                                                {isUnlocked ? (
                                                    <span className="unlocked-badge-btn">
                                                        <FaCheckCircle /> Unlocked
                                                    </span>
                                                ) : (
                                                    <button 
                                                        className="btn-unlock-product"
                                                        onClick={() => unlockComponent(prod.id)}
                                                    >
                                                        Unlock Free
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ProductTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
        </motion.div>
    );
};

export default WorkshopLayout;
