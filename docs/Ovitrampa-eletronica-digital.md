# Digital Electronic Ovitrap: Hardware and Construction Characteristics

**André Luís Araújo Cotta – 22.2.8990**  
**Agustina Josefina Cruz - 26.1.0001**

**May 18, 2026**

---

## Contents

1. [Introduction](#1-introduction)  
2. [Methodology](#2-methodology)  
3. [Identified Hardware Teams and Solutions](#3-identified-hardware-teams-and-solutions)  
4. [Digital Electronic Ovitrap Technical Assessment](#4-digital-electronic-ovitrap-technical-assessment)  
   4.1 [System Overview](#41-system-overview)  
   4.2 [Hardware Components](#42-hardware-components)  
   4.3 [Laser Detection Circuit](#43-laser-detection-circuit)  
   4.4 [Sample Recording and Storage Circuit via ESP32](#44-sample-recording-and-storage-circuit-via-esp32)  
   4.5 [Sample Processing](#45-sample-processing)  
5. [Technologies, Tools and Programming Languages](#5-technologies-tools-and-programming-languages)  
6. [Data Storage and Communication Flow](#6-data-storage-and-communication-flow)  
7. [Integration Classification](#7-integration-classification)  
8. [Dependencies, Risks and Integration Complexity](#8-dependencies-risks-and-integration-complexity)  
9. [Pending Information and Next Steps](#9-pending-information-and-next-steps)  
10. [Conclusions](#10-conclusions)  
11. [References](#11-references)  
12. [Appendices](#12-appendices)  
    - [Appendix A: ESP32 Code](#appendix-a---code-used-in-the-esp-32-for-sample-collection)  
    - [Appendix B: Python Processing Code](#appendix-b---code-used-for-sample-processing)

---

## 1. Introduction

This document covers the technical and construction data regarding the Digital Electronic Ovitrap, especially the embedded hardware and its respective descriptions. The Digital Electronic Ovitrap is equipment capable of collecting bio-acoustic audio samples of insects based on the detection of their presence when entering a cavity containing high-precision laser sensors.

To perform the detection, organic baits are deposited inside its central cavity to attract the insects; the bait used in this project consists of a solution of brewer's yeast in water in a proportion of 50mL of water to one tablespoon of brewer's yeast. After placing the bait, the equipment is positioned in the area of interest and left on for the storage of possible samples.

The collected samples are stored on an SD card and subsequently transmitted via packets in a LoRaWAN network to be submitted to a central post-processing server. Sample collection and storage are carried out by an ESP32 microcontroller and modules attached to it, such as the INMP441 module, which consists of an omnidirectional MEMS microphone with native digital output via I2S, and the MH-SD module, which is capable of holding SD cards for reading and writing.

---

## 2. Methodology

The methodology used in this report consisted of reviewing the available technical documentation, identifying the existing hardware solutions, and collecting information from the hardware teams through meetings and technical discussions.

The analysis focused on the current state of each system, including its hardware components, programming languages, communication protocols, data storage methods, and integration status with the dengue platform.

The main goal of this methodology is not to implement new features, but to understand and document how each hardware solution currently works, which systems are part of the dengue platform, which ones belong to separate initiatives, and what risks or dependencies may affect future integration.

---

## 3. Identified Hardware Teams and Solutions

This section summarizes the hardware solutions identified during the initial assessment and classifies them according to their current status and expected relationship with the dengue platform.

**Table 3.1. Hardware solutions and modules identified during the initial assessment.**

| Hardware Solution / Module | Main Contact / Team | Purpose | Current Status | Relation to Dengue Platform |
|---|---|---|---|---|
| Digital Electronic Ovitrap | André Luís Araújo Cotta / Hardware Team | Insect detection and bio-acoustic sample collection | Initial technical documentation available | Part of the dengue platform / integration under assessment |
| Laser Detection Circuit | Hardware Team | Detection of insect entry and exit events | Documented in the initial technical report | Internal module of the Digital Electronic Ovitrap |
| Audio Recording System | Hardware Team | Audio sample acquisition using ESP32 and INMP441 microphone | Documented in the initial technical report | Internal module of the Digital Electronic Ovitrap |
| Environmental Sensing Module | Hardware Team | Collection of environmental data using gas, particulate matter, temperature, humidity, and GPS sensors | Information collected from hardware team; full documentation pending | Internal module of the Digital Electronic Ovitrap / integration details to be confirmed |
| LoRa / LoRaWAN Communication | Hardware Team / To be confirmed | Transmission of collected data to the network or central server | Mentioned, but final architecture not fully documented | Expected communication layer with the dengue platform |
| Other hardware initiatives | To be confirmed | To be confirmed | Pending identification | To be confirmed |

At this stage, the Digital Electronic Ovitrap is the main hardware solution documented. The system is designed to detect insects using laser sensors, collect audio samples with an ESP32 and an INMP441 microphone, store the samples on an SD card, and transmit collected data through a LoRa or LoRaWAN network.

In addition to the audio acquisition and laser detection system, the ovitrap also includes an environmental sensing module located in the upper cover of the device. This module includes four volatile gas sensors — MQ-2, MQ-4, MQ-135, and MQ-9 — as well as a SEN50 particulate matter sensor, a DHT11 temperature and humidity sensor, and a GY-6MV2 GPS module. These sensors are expected to be connected to a microcontroller, which will transmit the collected environmental data together with the audio data through the LoRa network.

---

## 4. Digital Electronic Ovitrap Technical Assessment

### 4.1 System Overview

The Digital Electronic Ovitrap is a hardware system designed to detect the presence of insects and collect bio-acoustic audio samples for later analysis. The system operates by attracting insects into a detection cavity using an organic bait solution. Once an insect enters the cavity, its presence is detected through a laser-based sensing system composed of photodiodes and signal conditioning circuits.

When a detection event occurs, the circuit generates a logic signal that is used as a trigger for an ESP32 microcontroller. The ESP32 then records a two-second audio sample using an INMP441 digital microphone and stores the sample as a sequential `.wav` file on an SD card through the MH-SD module.

The collected samples are later analyzed using a Python-based signal processing algorithm. This algorithm applies the Fast Fourier Transform, also known as FFT, to identify relevant frequency components associated with mosquito sounds. The current processing stage allows the user to inspect the frequency spectrum and compare the signal magnitude within frequency ranges associated with male and female mosquitoes.

In general terms, the system can be described as a chain composed of four main stages: insect detection, audio acquisition, local data storage, and sample processing.

![Figure 4.1.1. General operation flow of the Digital Electronic Ovitrap.](images/page-06-image-1.png)

**Figure 4.1.1. General operation flow of the Digital Electronic Ovitrap.**

At this stage, the Digital Electronic Ovitrap is the main documented hardware solution available for assessment. Further analysis is required to confirm how this device will be integrated into the dengue platform and whether additional hardware systems are part of the same platform or belong to separate initiatives.

### 4.2 Hardware Components

The Digital Electronic Ovitrap is composed of analog detection circuits, embedded processing hardware, audio acquisition modules, local storage components, and visual signaling elements. The hardware design combines a laser-based insect detection stage with an ESP32-based recording and storage system.

The main materials listed for the current hardware solution are shown below:

**Table 4.2.1. Materials used in the Digital Electronic Ovitrap.**

| Quantity / Component | Function in the System |
|---|---|
| 12V Symmetric Power Supply | Provides the required power supply for the analog detection circuit. |
| 2x IC LM311 (Schmitt Trigger) | Used to generate a digital logic signal when the analog input signal reaches a defined voltage threshold. |
| 2x IC OP07 (OpAmp) | Used in the signal conditioning stage to amplify and process the low-amplitude signal generated by the photodiodes. |
| 40x BPW34 (Photodiodes) | Detect the laser light inside the ovitrap cavity and respond to changes caused by insect movement. |
| 3x LM7805 (Voltage Regulator) | Regulate voltage levels to provide stable 5V power for circuit components. |
| 2x 10k Ohm Resistors | Used in the analog detection and signal conditioning circuit. |
| 3x 1k Ohm Resistors | Used in the analog detection and signal conditioning circuit. |
| 2x 10 Ohm Resistors | Used in the analog detection and signal conditioning circuit. |
| 2x 200k Ohm Resistors | Used in the analog detection and signal conditioning circuit. |
| 1x ESP32 WROOM 32 DEVKIT | Main embedded controller responsible for receiving the trigger signal, recording audio, and managing storage. |
| 1x INMP441 Module | Digital MEMS microphone used to capture the insect audio sample. |
| 1x MH-SD Module | SD card module used to store the recorded `.wav` audio files locally. |
| 1x Green LED | Optional visual indicator for system or detection events. |
| 1x Red LED | Optional visual indicator for system or detection events. |

### 4.3 Laser Detection Circuit

The circuit for detecting the entry and exit of insects consists of using photodiodes (BPW34) and Schmitt Trigger type circuits. Photodiodes are electronic components that, when subjected to light excitation at a given wavelength, conduct electricity; in our case, the light excitation comes from lasers with linear scattering centered on an array composed of 20 photodiodes.

When excited with the wavelength of light from the lasers, the photodiodes enter conduction; thus, we connect a +12Vcc source at one end of this array and at the other end, we use the resulting current in a circuit topology known as a current-controlled voltage source, which transforms and amplifies the resulting current from the excitation of the photodiodes into a voltage with a corresponding amplitude.

![Figure 1 - BPW34 and its sensitivity to wavelengths.](images/page-08-image-1.png)

**Figure 1 - Bpw34 and its sensitivity to wavelengths.**

![Figure 2 - View of the PCB to compose the two photodiode arrays.](images/page-09-image-1.png)

**Figure 2 - View of the PCB to compose the two photodiode arrays.**

After this, this voltage is used in a Schmitt Trigger circuit, which functions as a voltage level detector capable of returning a +5Vcc signal at its output whenever the input signal reaches a set value. The input signal of this circuit is analog and of very low amplitude, so the Schmitt trigger acts as an analog-to-digital converter. To implement this circuit, the OP07 (Operational Amplifier) and LM311 (Schmitt Trigger) integrated circuits were used.

![Figure 3 - Simulation schematic visualization of the two photodiode arrays.](images/page-09-image-2.png)

**Figure 3 - Simulation schematic visualization of the two photodiode arrays.**

![Figure 5 - Integrated circuits used to compose the current-controlled voltage source and Schmitt trigger.](images/page-10-image-1.png)

![Figure 5 - Integrated circuits used to compose the current-controlled voltage source and Schmitt trigger.](images/page-10-image-3.png)

![Figure 5 - Integrated circuits used to compose the current-controlled voltage source and Schmitt trigger.](images/page-10-image-4.png)

**Figure 5 - Integrated circuits used to compose the current-controlled voltage source and Schmitt trigger.**

![Figure 6 - View of the PCB to compose the current-controlled voltage source and Schmitt trigger circuit.](images/page-10-image-5.png)

**Figure 6 - View of the PCB to compose the current-controlled voltage source and Schmitt trigger circuit.**

![Figure 7 - Simulation schematic visualization of the current-controlled voltage source and Schmitt trigger circuit.](images/page-11-image-1.png)

**Figure 7 - Simulation schematic visualization of the current-controlled voltage source and Schmitt trigger circuit.**

In this project, two copies of this set of circuits are used, one for entry detection and another for exit, where depending on which sensor is activated first, we determine whether it is an insect entry or exit sample.

![Figure 8 - Inside of the detection cavity with detector circuits installed.](images/page-11-image-2.png)

**Figure 8 - Inside of the detection cavity with detector circuits installed.**

### 4.4 Sample Recording and Storage Circuit via ESP32

Sample collection consists of using the logic signal from the previous circuit to serve as a trigger for an ESP32 microcontroller to record a 2-second audio sample through the INMP441 microphone and save it in a sequential `.wav` file on the MH-SD module with a previously inserted SD card.

![Figure 9 - ESP32 Wroom 32 DEVKIT, MH-SD and INMP441.](images/page-12-image-1.png)

![Figure 9 - ESP32 Wroom 32 DEVKIT, MH-SD and INMP441.](images/page-12-image-2.png)

![Figure 9 - ESP32 Wroom 32 DEVKIT, MH-SD and INMP441.](images/page-12-image-3.png)

**Figure 9 - ESP32 Wroom 32 DEVKIT, MH-SD and INMP441.**

![Figure 10 - Pinout schematic for the sample recording circuit.](images/page-12-image-4.png)

**Figure 10 - Pinout schematic for the sample recording circuit.**

The code developed for the device is attached in Appendix A; this code uses the signal coming from the Schmitt Trigger on ports 33 and 34 to activate the flag that executes the audio recording function `recordAudio()`. Two LEDs can be optionally connected to ports 17 and 16 to signal the detection of possible insect entry and exit.

### 4.5 Sample Processing

The analysis of the samples is performed through a Python algorithm present in Appendix B that performs the FFT of the signal present in the `.WAV` file and measures the signal power in different frequency ranges in which male and female mosquitoes may have possibly emitted the samples. When analyzing a sample, the algorithm returns a graph containing the analyzed frequency spectrum and the magnitude in each spectrum, so that through visual inspection the user easily identifies the gender and species of the sample.

---

## 5. Technologies, Tools and Programming Languages

This section summarizes the main technologies, programming languages, communication interfaces, and tools currently identified in the Digital Electronic Ovitrap system.

**Table 5.1. Technologies, tools and programming languages used in the Digital Electronic Ovitrap.**

| Category | Technology / Tool | Function in the System |
|---|---|---|
| Microcontroller | ESP32 WROOM 32 DEVKIT | Main embedded controller used to receive trigger signals, record audio samples, and manage local storage. |
| Embedded programming language | C / C++ | Used to program the ESP32 and implement the audio recording, SD card storage, and peripheral configuration logic. |
| Audio acquisition module | INMP441 Module | Digital MEMS microphone used to capture audio samples from insects. |
| Audio communication interface | I2S | Digital audio interface used between the INMP441 microphone and the ESP32. |
| Local storage module | MH-SD Module | Module used to connect an SD card to the ESP32 for storing recorded audio files. |
| Storage communication interface | SPI | Communication interface used between the ESP32 and the SD card module. |
| Data format | `.wav` | Audio file format used to store the recorded samples. |
| Detection components | BPW34 Photodiodes | Used to detect the laser light variations caused by insect movement. |
| Signal conditioning | OP07 OpAmp | Used to amplify and condition the low-amplitude signal from the photodiodes. |
| Threshold detection | LM311 / Schmitt Trigger | Used to convert the analog detection signal into a digital logic signal. |
| Wireless communication | LoRaWAN | Mentioned as the network used to transmit collected samples/data packets to a central server. |
| Signal processing language | Python | Used for post-processing the recorded `.wav` samples. |
| Signal processing method | FFT | Used to analyze the frequency spectrum of the audio samples. |
| Python libraries | NumPy, SoundFile, Matplotlib | Used to read audio files, calculate the FFT, and plot the frequency spectrum. |

The embedded part of the system is implemented using the ESP32 and its peripherals. The ESP32 receives trigger signals from the detection circuit, records two-second audio samples using the INMP441 microphone through I2S, and stores the resulting `.wav` files on an SD card through the MH-SD module. The sample processing stage is implemented in Python, where FFT is applied to analyze the frequency components of the recorded audio samples.

LoRaWAN is also mentioned in the initial documentation as the communication network used to transmit collected data packets to a central post-processing server. However, details about the LoRaWAN infrastructure, gateway, backend, and final database still need to be confirmed with the project team.

---

## 6. Data Storage and Communication Flow

This section describes how data is generated, stored, and transmitted in the current Digital Electronic Ovitrap system. The data flow begins when an insect is detected inside the ovitrap cavity and ends when the recorded sample is analyzed using the Python processing algorithm.

In the current implementation, the laser detection circuit generates a logic signal when an insect entry or exit event is detected. This signal is received by the ESP32 microcontroller and used as a trigger to start the audio recording process. The ESP32 records a two-second audio sample using the INMP441 digital microphone and stores the sample locally as a sequential `.wav` file on an SD card through the MH-SD module.

The current local storage method is based on SD card storage. Each recorded sample is saved as a `.wav` file, using a sequential naming structure such as `rec_0.wav`, `rec_1.wav`, and so on. This allows the samples to be stored locally for later retrieval and analysis.

**Table 6.1. Current data storage methods identified in the Digital Electronic Ovitrap.**

| Data Type | Format | Storage Location | Description |
|---|---|---|---|
| Audio sample | `.wav` | SD card | Two-second audio sample recorded after a detection event. |
| Processed result | Graph / frequency spectrum | Local computer / processing environment | Result generated by the Python FFT algorithm. |
| Detection event | Logic signal | ESP32 input | Trigger signal generated by the laser detection circuit. |

The general data flow can be summarized as follows:

![Figure 6.1. Data storage and processing flow of the Digital Electronic Ovitrap.](images/page-15-image-1.png)

**Figure 6.1. Data storage and processing flow of the Digital Electronic Ovitrap.**

According to the initial documentation, the collected samples are intended to be transmitted through a LoRaWAN network in packets and submitted to a central post-processing server. However, the current documentation does not yet provide enough detail about the complete LoRaWAN infrastructure, gateway, server, database, or final platform integration. These elements should be confirmed with the technical team before the integration architecture is finalized.

For this reason, the current confirmed flow can be divided into two levels:

**Table 6.2. Confirmed and pending communication flow information.**

| Flow Stage | Current Status | Notes |
|---|---|---|
| Local detection | Confirmed | Laser detection circuit generates trigger signal. |
| Local audio recording | Confirmed | ESP32 records two-second audio samples. |
| Local storage | Confirmed | Samples are stored as `.wav` files on SD card. |
| Local processing | Confirmed | Python script applies FFT to the recorded audio. |
| LoRaWAN transmission | Mentioned / To be confirmed | Documentation mentions packet transmission through LoRaWAN. |
| Central server | To be confirmed | Server architecture and processing flow need confirmation. |
| Database | To be confirmed | No database information is currently defined in the available documentation. |
| Dengue platform integration | To be confirmed | Final integration flow still needs to be mapped. |

At this stage, the most clearly documented storage method is the local SD card storage of `.wav` files. The communication flow beyond the device, especially the LoRaWAN transmission and the central post-processing server, requires further technical clarification with the project team.

---

## 7. Integration Classification

This section classifies the identified hardware systems according to their expected relationship with the dengue platform. The objective is to determine which hardware components are intended to be integrated into the platform and which elements still require confirmation.

Based on the available documentation and the information collected from the hardware team, the Digital Electronic Ovitrap appears to be the main hardware solution associated with the dengue platform. The system includes insect detection, audio sample recording, local `.wav` storage, environmental sensing, GPS localization, and data transmission through the LoRa network. The initial documentation also mentions that collected samples are intended to be transmitted through LoRaWAN packets to a central post-processing server.

**Table 7.1. Integration classification of identified hardware systems.**

| Hardware System / Module | Integration with Dengue Platform | Current Status | Notes |
|---|---|---|---|
| Digital Electronic Ovitrap | Planned / Under assessment | Main documented hardware solution | Includes insect detection, audio acquisition, local storage, and sample processing. |
| Laser Detection Circuit | Integrated into the ovitrap | Documented | Responsible for detecting insect entry and exit events using lasers, BPW34 photodiodes, OP07, and LM311 Schmitt Trigger circuits. |
| Audio Recording System | Integrated into the ovitrap | Documented | Uses ESP32 and INMP441 microphone to record two-second audio samples after a detection event. |
| Local Storage System | Integrated into the ovitrap | Documented | Stores recorded audio samples as sequential `.wav` files on an SD card through the MH-SD module. |
| Sample Processing Algorithm | Related to the ovitrap / platform processing | Documented | Python algorithm applies FFT to analyze the frequency spectrum of the recorded `.wav` files. |
| Environmental Sensing Module | Planned integration / To be confirmed | Information collected from hardware team | Includes MQ-2, MQ-4, MQ-135, MQ-9, SEN50, DHT11, and GY-6MV2 GPS module. |
| LoRa / LoRaWAN Communication | Planned integration / To be confirmed | Mentioned, but architecture not fully documented | Expected to transmit audio and environmental sensor data to the network or central server. |
| Central Server / Database | To be confirmed | Not yet documented | It is still necessary to confirm where data will be received, stored, processed, and made available to the dengue platform. |
| Other hardware systems | To be confirmed | Pending identification | It must be confirmed whether there are other hardware initiatives related to the dengue platform or separate projects. |

The Digital Electronic Ovitrap should be considered part of the dengue platform because its purpose is directly related to mosquito detection and sample collection. The laser detection circuit, audio recording system, local storage system, and sample processing algorithm are already described in the current technical documentation.

The environmental sensing module also appears to be part of the same ovitrap architecture. According to the information provided by the hardware team, the upper cover of the ovitrap includes four volatile gas sensors, a particulate matter sensor, a temperature and humidity sensor, and a GPS module. These modules are expected to be connected to a microcontroller, which will transmit the collected environmental data together with the audio data through the LoRa network.

The environmental sensing module also appears to be part of the same ovitrap architecture. According to the information provided by the hardware team, the upper cover of the ovitrap includes four volatile gas sensors: MQ-2, MQ-4, MQ-135, and MQ-9. It also includes a SEN50 particulate matter sensor, a DHT11 sensor for temperature and humidity, and a GY-6MV2 GPS module. These modules are expected to be connected to a microcontroller responsible for collecting environmental sensor data and transmitting it together with the audio data through the LoRa network.

**Table 7.2. Preliminary integration classification summary.**

| Component / System | Preliminary Classification |
|---|---|
| Digital Electronic Ovitrap | Part of the dengue platform; integration currently under assessment. |
| Laser Detection Circuit | Internal module of the Digital Electronic Ovitrap. |
| Audio Recording System | Internal module of the Digital Electronic Ovitrap. |
| Local Storage System | Internal module of the Digital Electronic Ovitrap. |
| Sample Processing Algorithm | Related to the ovitrap and possible platform-side processing. |
| Environmental Sensing Module | Internal module of the Digital Electronic Ovitrap; integration details still to be confirmed. |
| LoRa Communication | Expected communication layer with the platform; final architecture still to be confirmed. |
| Central Server and Database | Pending confirmation. |
| Other Hardware Initiatives | Pending identification. |

Although the main hardware modules have been identified, several integration aspects still require confirmation. In particular, the final communication architecture, the LoRa or LoRaWAN infrastructure, the central server, the database, and the way the dengue platform will consume the data are not yet fully documented.

The next step is to confirm with the project team whether the platform will receive raw audio files, processed FFT results, environmental sensor measurements, GPS location data, alerts, or a combination of these data types.

---

## 8. Dependencies, Risks and Integration Complexity

This section identifies the main technical and organizational dependencies, risks, and integration challenges related to the Digital Electronic Ovitrap and its connection with the dengue platform. The objective is to understand which parts of the hardware system are already documented and which aspects still require further confirmation before full integration.

The Digital Electronic Ovitrap currently depends on several internal hardware and software modules, including the laser detection circuit, the ESP32-based recording system, the INMP441 microphone, the SD card module, the environmental sensing module, and the LoRa or LoRaWAN communication layer. The initial documentation confirms the use of the ESP32 for audio recording and local `.wav` file storage, as well as Python-based FFT analysis for sample processing.

**Table 8.1. Dependencies, risks and integration complexity of the Digital Electronic Ovitrap.**

| Area | Dependency / Risk | Possible Impact | Integration Complexity |
|---|---|---|---|
| Laser Detection Circuit | Correct alignment and operation of lasers and BPW34 photodiodes | Incorrect detection of insect entry or exit events | Medium |
| Signal Conditioning | OP07 and LM311 circuits must correctly convert low-amplitude analog signals into logic signals | False triggers or missed detection events | Medium |
| ESP32 Recording System | ESP32 must correctly receive trigger signals and execute the `recordAudio()` function | Audio samples may not be recorded when detection occurs | Medium |
| Audio Acquisition | INMP441 microphone must capture usable audio samples | Poor audio quality may affect sample analysis | Medium |
| Local Storage | SD card and MH-SD module must store `.wav` files reliably | Data loss or corrupted audio files | Medium |
| Sample Processing | Python FFT algorithm depends on valid `.wav` files and correct frequency range analysis | Incorrect or incomplete mosquito classification | Medium |
| Environmental Sensing Module | MQ sensors, SEN50, DHT11, and GPS module must be correctly connected and calibrated | Environmental data may be incomplete, inaccurate, or unavailable | Medium to High |
| LoRa / LoRaWAN Communication | Requires confirmed network architecture, gateway, and communication configuration | Data may not reach the platform or central server | High |
| Central Server / Database | Server and database architecture are not yet fully documented | Unclear where data will be stored, processed, or accessed | High |
| Platform Integration | It is still necessary to define what data the dengue platform will receive | Integration may require additional APIs, data formatting, or backend development | High |
| Documentation | Some system components are documented, while others still require confirmation | Difficulty maintaining or scaling the system | Medium |
| Team Coordination | Integration depends on communication between hardware, software, and platform teams | Delays or inconsistent technical decisions | Medium |

The main technical risks are related to communication, data storage, and integration with the central platform. While the local operation of the Digital Electronic Ovitrap is partially documented, the complete communication flow from the device to the dengue platform still needs to be confirmed. In particular, the LoRa or LoRaWAN network architecture, the gateway configuration, the central server, and the final database are still pending detailed documentation.

Another relevant risk is related to data format and processing. The current system records audio samples as `.wav` files and processes them using a Python FFT algorithm. However, it is still necessary to define whether the dengue platform will receive raw audio files, processed FFT results, environmental sensor measurements, GPS coordinates, alerts, or a combination of these outputs.

The environmental sensing module increases the integration complexity because it adds additional data sources to the system. Besides audio samples, the platform may also need to handle gas sensor readings, particulate matter data, temperature, humidity, and GPS location. This requires a clear data structure, timestamping strategy, and communication protocol.

At this stage, the integration complexity can be summarized as follows:

**Table 8.2. Preliminary integration complexity assessment.**

| Component / Module | Complexity Level | Reason |
|---|---|---|
| Laser Detection Circuit | Medium | Requires correct analog signal conditioning and sensor alignment. |
| Audio Recording System | Medium | Depends on reliable ESP32 trigger detection, I2S audio acquisition, and `.wav` file generation. |
| Local SD Storage | Medium | Requires reliable file writing and data retrieval from the SD card. |
| Python Sample Processing | Medium | Depends on valid audio samples and correct FFT-based analysis. |
| Environmental Sensing Module | Medium to High | Includes multiple sensors and requires calibration, data formatting, and integration with the microcontroller. |
| LoRa / LoRaWAN Communication | High | Network architecture, packet format, gateway, and server-side reception still need confirmation. |
| Central Server and Database | High | Storage, processing, database schema, and platform access are still not fully defined. |
| Full Dengue Platform Integration | High | Requires coordination between hardware, communication, backend, database, and platform visualization layers. |

Overall, the Digital Electronic Ovitrap presents a moderate level of complexity at the device level and a higher level of complexity at the platform integration level. The hardware modules are partially documented, but the complete end-to-end flow from data acquisition to platform visualization still requires additional technical definition.

---

## 9. Pending Information and Next Steps

This section summarizes the information that still needs to be confirmed and the recommended next steps to complete the technical and organizational assessment of the hardware systems related to the dengue platform.

Although the Digital Electronic Ovitrap is already partially documented, some elements of the complete integration architecture are still pending. In particular, further clarification is required regarding the LoRa or LoRaWAN communication layer, the central server, the database, the environmental sensing module, and the final data flow between the hardware and the dengue platform.

**Table 9.1. Pending information identified during the assessment.**

| Pending Information | Description | Priority |
|---|---|---|
| LoRa / LoRaWAN architecture | Confirm whether the system uses LoRa or LoRaWAN, which gateway is used, and how the packets are received. | High |
| Gateway availability | Confirm whether a LoRa/LoRaWAN gateway is already installed, configured, and available for testing. | High |
| Data transmission format | Define whether the device will send raw audio files, processed data, environmental measurements, GPS coordinates, alerts, or metadata. | High |
| Central server | Identify the server responsible for receiving and processing the transmitted data. | High |
| Database | Confirm whether a database already exists and define what information will be stored. | High |
| Platform integration | Define how the dengue platform will access, display, and use the data collected by the ovitrap. | High |
| Environmental sensing module documentation | Complete the documentation of the MQ-2, MQ-4, MQ-135, MQ-9, SEN50, DHT11, and GPS module integration. | Medium |
| Sensor calibration | Confirm whether the gas sensors, particulate matter sensor, temperature/humidity sensor, and GPS module require calibration or validation. | Medium |
| Power supply strategy | Confirm how the final device will be powered during field operation. | Medium |
| Repository organization | Confirm where the hardware documentation, firmware, processing scripts, and diagrams will be stored in GitHub. | Medium |
| Responsible team members | Confirm the person or team responsible for each hardware module and integration layer. | Medium |

The main next steps are listed below.

**Table 9.2. Recommended next steps.**

| Next Step | Description | Responsible Area |
|---|---|---|
| Confirm communication architecture | Define the final LoRa or LoRaWAN architecture, including gateway, packet format, and server reception. | Hardware / Communication Team |
| Define transmitted data | Decide what information will be sent from the device to the platform. | Hardware / Platform Team |
| Document environmental sensors | Complete the technical documentation of the environmental sensing module. | Hardware Team |
| Confirm backend and database | Identify the server, database, and backend components that will receive and store the data. | Backend / Platform Team |
| Define data model | Establish the structure of the data that will be stored and used by the platform. | Backend / Platform Team |
| Organize GitHub repository | Upload or organize documentation, firmware, processing scripts, diagrams, and meeting notes. | Project Team |
| Validate end-to-end flow | Test the complete flow from detection and data acquisition to transmission, storage, and platform visualization. | Hardware / Backend / Platform Team |

At this stage, the most important pending task is to confirm the complete end-to-end data flow. The current documentation describes the local hardware operation, including detection, audio recording, SD card storage, and Python-based processing. However, the integration path from the ovitrap to the dengue platform still requires further definition.

The following questions should be answered in the next meetings:

- Is the system using LoRa?
- Is there already a gateway available for testing?
- What data will be transmitted to the platform?
- Will the platform receive raw `.wav` files, processed FFT results, environmental sensor data, GPS coordinates, alerts, or all of these?
- Where will the data be stored?
- Is there already a central server or database?
- Who is responsible for the backend and database integration?
- How will the dengue platform visualize or use the collected data?
- Where should the documentation and code be stored in GitHub?

In summary, the next phase should focus on completing the missing technical information, validating the communication architecture, and organizing all findings in the project repository. This will allow the team to move from hardware assessment to a clearer integration plan for the dengue platform.

---

## 10. Conclusions

The initial assessment allowed the identification of the Digital Electronic Ovitrap as the main hardware solution related to the dengue platform. This system combines insect detection, audio acquisition, local data storage, sample processing, environmental sensing, GPS localization, and LoRa-based communication.

The current documentation provides a clear description of the main internal modules of the ovitrap, including the laser detection circuit, the ESP32-based audio recording system, the SD card storage method, and the Python-based sample processing algorithm. The laser detection circuit is responsible for detecting insect entry and exit events, while the ESP32 records two-second audio samples using the INMP441 microphone and stores them as sequential `.wav` files on an SD card.

The sample processing stage is currently based on a Python algorithm that applies FFT analysis to the recorded audio files. This allows the frequency spectrum of each sample to be analyzed and supports the visual identification of frequency components associated with male and female mosquitoes.

In addition to the audio and detection system, the ovitrap also includes an environmental sensing module composed of MQ-2, MQ-4, MQ-135, MQ-9, SEN50, DHT11, and GPS sensors. This module is expected to collect environmental and location data and transmit it together with the audio-related data through the LoRa network.

However, some important integration aspects are still pending. The LoRa or LoRaWAN communication architecture, gateway availability, central server, database structure, transmitted data format, and final platform integration flow still need to be confirmed with the project team.

Overall, the Digital Electronic Ovitrap presents a documented and technically relevant hardware foundation for the dengue platform. The main challenge is no longer only the local hardware operation, but the complete integration of the device with the communication, backend, database, and platform visualization layers.

---

## 11. References

The following sources were used as reference material for the development of this report:

1. **Initial technical documentation of the Digital Electronic Ovitrap**  
   Document provided by the hardware team, including the general description of the system, materials list, laser detection circuit, ESP32-based recording and storage system, and sample processing algorithm.

2. **ESP32 firmware for sample collection**  
   Code included in Appendix A of the initial technical documentation. The firmware describes the configuration of the ESP32, I2S audio acquisition, SD card storage, `.wav` file generation, and trigger-based recording process.

3. **Python sample processing algorithm**  
   Code included in Appendix B of the initial technical documentation. The algorithm reads `.wav` files, applies FFT analysis, evaluates frequency ranges associated with male and female mosquitoes, and generates a frequency spectrum graph.

4. **Information provided by the hardware team**  
   Technical explanation provided by the hardware team regarding the environmental sensing module located in the upper cover of the ovitrap, including MQ-2, MQ-4, MQ-135, MQ-9, SEN50, DHT11, GPS module, and LoRa communication.

5. **Project meetings and technical discussions**  
   Information collected during project discussions related to the current hardware status, expected integration with the dengue platform, pending communication architecture, and future documentation needs.

---

## 12. Appendices

### Appendix A - Code Used in the ESP-32 for Sample Collection

```cpp
#include <driver/i2s.h>
#include "FS.h"
#include "SD.h"
#include "SPI.h"
#include <math.h>

#define I2S_PORT              I2S_NUM_0
#define RECORD_DURATION_SEC   2
#define SAMPLE_RATE           16000
#define BITS_PER_SAMPLE       I2S_BITS_PER_SAMPLE_16BIT
#define NUM_CHANNELS          1

const float GAIN_FACTOR = 700;

#define BYTES_A_GRAVAR        (SAMPLE_RATE * (16 / 8) * NUM_CHANNELS * RECORD_DURATION_SEC)
#define I2S_READ_BUFFER_SIZE  1024

#define TRIGGER_PIN1          33
#define TRIGGER_PIN2          35

#define I2S_BCLK              26
#define I2S_LRCLK             25
#define I2S_DIN               34

#define SPI_MOSI              23
#define SPI_MISO              19
#define SPI_SCK               18
#define SD_CS                 5

int fileIndex = 0;

float b0_f, b1_f, b2_f, a1_f, a2_f;
float x_n_1 = 0, x_n_2 = 0;
float y_n_1 = 0, y_n_2 = 0;

void calcularCoeficientesFiltro() {
  float fL = 300.0;
  float fH = 800.0;
  float fs = (float)SAMPLE_RATE;

  float fc = sqrt(fL * fH);
  float BW = fH - fL;
  float Q = fc / BW;
  float w0 = 2.0 * PI * fc / fs;
  float alpha = sin(w0) / (2.0 * Q);

  float a0 = 1.0 + alpha;
  b0_f = alpha / a0;
  b1_f = 0.0;
  b2_f = -alpha / a0;
  a1_f = (-2.0 * cos(w0)) / a0;
  a2_f = (1.0 - alpha) / a0;

  Serial.println("Coeficientes do filtro passa-faixa configurados.");
}

void writeWavHeader(File file, long dataSize) {
  long fileSize = dataSize + 44 - 8;
  long byteRate = SAMPLE_RATE * NUM_CHANNELS * (16 / 8);
  int blockAlign = NUM_CHANNELS * (16 / 8);
  byte header[44];

  header[0] = 'R'; header[1] = 'I'; header[2] = 'F'; header[3] = 'F';
  header[4] = (byte)(fileSize & 0xFF);
  header[5] = (byte)((fileSize >> 8) & 0xFF);
  header[6] = (byte)((fileSize >> 16) & 0xFF);
  header[7] = (byte)((fileSize >> 24) & 0xFF);
  header[8] = 'W'; header[9] = 'A'; header[10] = 'V'; header[11] = 'E';
  header[12] = 'f'; header[13] = 'm'; header[14] = 't'; header[15] = ' ';
  header[16] = 16; header[17] = 0; header[18] = 0; header[19] = 0;
  header[20] = 1; header[21] = 0;
  header[22] = (byte)NUM_CHANNELS; header[23] = 0;
  header[24] = (byte)(SAMPLE_RATE & 0xFF);
  header[25] = (byte)((SAMPLE_RATE >> 8) & 0xFF);
  header[26] = (byte)((SAMPLE_RATE >> 16) & 0xFF);
  header[27] = (byte)((SAMPLE_RATE >> 24) & 0xFF);
  header[28] = (byte)(byteRate & 0xFF);
  header[29] = (byte)((byteRate >> 8) & 0xFF);
  header[30] = (byte)((byteRate >> 16) & 0xFF);
  header[31] = (byte)((byteRate >> 24) & 0xFF);
  header[32] = (byte)blockAlign; header[33] = 0;
  header[34] = (byte)16; header[35] = 0;
  header[36] = 'd'; header[37] = 'a'; header[38] = 't'; header[39] = 'a';
  header[40] = (byte)(dataSize & 0xFF);
  header[41] = (byte)((dataSize >> 8) & 0xFF);
  header[42] = (byte)((dataSize >> 16) & 0xFF);
  header[43] = (byte)((dataSize >> 24) & 0xFF);

  file.seek(0);
  file.write(header, 44);
}

void setupI2S() {
  i2s_config_t i2sConfig = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = BITS_PER_SAMPLE,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,
    .dma_buf_len = 64,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
  };

  i2s_pin_config_t pinConfig = {
    .bck_io_num = I2S_BCLK,
    .ws_io_num = I2S_LRCLK,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = I2S_DIN
  };

  i2s_driver_install(I2S_PORT, &i2sConfig, 0, NULL);
  i2s_set_pin(I2S_PORT, &pinConfig);
  Serial.println("Driver I2S configurado.");
}

void setupSD() {
  SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI, SD_CS);
  if (!SD.begin(SD_CS)) {
    Serial.println("Falha ao montar o cartão SD!");
    while (1);
  }
  Serial.println("Cartão SD montado com sucesso.");
}

void recordAudio() {
  String filename = "/rec_" + String(fileIndex++) + ".wav";
  File file = SD.open(filename, FILE_WRITE);

  if (!file) {
    Serial.println("Falha ao criar o arquivo no SD.");
    return;
  }

  Serial.print("Iniciando gravação: ");
  Serial.println(filename);

  byte dummyHeader[44];
  file.write(dummyHeader, 44);

  uint8_t i2sBuffer[I2S_READ_BUFFER_SIZE];
  long totalBytesGravados = 0;
  size_t bytesLidosDoI2S;

  x_n_1 = 0; x_n_2 = 0;
  y_n_1 = 0; y_n_2 = 0;

  while (totalBytesGravados < BYTES_A_GRAVAR) {
    int bytesParaLer = min((int)I2S_READ_BUFFER_SIZE, (int)(BYTES_A_GRAVAR - totalBytesGravados));
    i2s_read(I2S_PORT, i2sBuffer, bytesParaLer, &bytesLidosDoI2S, portMAX_DELAY);

    int16_t* samples = (int16_t*)i2sBuffer;
    int num_samples = bytesLidosDoI2S / 2;

    for (int i = 0; i < num_samples; i++) {
      float x_n = (float)samples[i];
      float y_n = b0_f * x_n + b1_f * x_n_1 + b2_f * x_n_2 - a1_f * y_n_1 - a2_f * y_n_2;

      x_n_2 = x_n_1;
      x_n_1 = x_n;
      y_n_2 = y_n_1;
      y_n_1 = y_n;

      int32_t amostraProcessada = (int32_t)(y_n * GAIN_FACTOR);
      if (amostraProcessada > 32767) {
        amostraProcessada = 32767;
      } else if (amostraProcessada < -32768) {
        amostraProcessada = -32768;
      }

      samples[i] = (int16_t)amostraProcessada;
    }

    file.write(i2sBuffer, bytesLidosDoI2S);
    totalBytesGravados += bytesLidosDoI2S;
  }

  Serial.print("Gravação finalizada. Total de bytes: ");
  Serial.println(totalBytesGravados);
  writeWavHeader(file, totalBytesGravados);
  file.close();
  Serial.println("Arquivo salvo.");
}

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando...");

  pinMode(TRIGGER_PIN1, INPUT_PULLDOWN);
  pinMode(TRIGGER_PIN2, INPUT_PULLDOWN);
  pinMode(17, OUTPUT);
  pinMode(16, OUTPUT);

  setupI2S();
  setupSD();
  calcularCoeficientesFiltro();

  Serial.println("Sistema pronto. Aguardando gatilho no pino D33...");
}

void loop() {
  digitalWrite(17, LOW);
  digitalWrite(16, LOW);

  if (digitalRead(TRIGGER_PIN2) == LOW) {
    digitalWrite(17, HIGH);
    digitalWrite(16, HIGH);
    recordAudio();
  }
}
```

### Appendix B - Code Used for Sample Processing

```python
import numpy as np
import soundfile as sf
import matplotlib.pyplot as plt

caminho_arquivo = 'C:/Users/User/Documents/Audacity/rec_0.wav'
y, Fs = sf.read(caminho_arquivo)

if y.ndim > 1:
    y = np.mean(y, axis=1)

# 2. Calcular a FFT
N = len(y)
Y = np.fft.fft(y)
f = np.arange(N) * (Fs / N)
half_N = N // 2
f = f[:half_N]
Y_mag = np.abs(Y[:half_N])

faixa_femea = (300, 450)
faixa_macho = (550, 750)

idx_femea = np.where((f >= faixa_femea[0]) & (f <= faixa_femea[1]))[0]
idx_macho = np.where((f >= faixa_macho[0]) & (f <= faixa_macho[1]))[0]

pico_femea = np.max(Y_mag[idx_femea]) if len(idx_femea) > 0 else 0
pico_macho = np.max(Y_mag[idx_macho]) if len(idx_macho) > 0 else 0

limiar_deteccao = 50.0

print("--- Resultados da Detecção ---")
print(f"Pico na faixa das Fêmeas (300-450Hz): {pico_femea:.2f}")
print(f"Pico na faixa dos Machos (500-700Hz): {pico_macho:.2f}")

plt.figure(figsize=(10, 5))
plt.plot(f, Y_mag, color='gray', label='Espectro Total')
plt.plot(f[idx_femea], Y_mag[idx_femea], color='red', label='Faixa Fêmea (300-450Hz)')
plt.plot(f[idx_macho], Y_mag[idx_macho], color='blue', label='Faixa Macho (500-700Hz)')
plt.axhline(y=limiar_deteccao, color='green', linestyle='--', label='Limiar de Detecção')
plt.xlim(0, 1000)  # Focando até 1000Hz
plt.xlabel('Frequência (Hz)')
plt.ylabel('Magnitude')
plt.title('Detecção de Mosquitos via FFT')
plt.legend()
plt.grid(True)
plt.show()
```
