import React, { useEffect, useState } from "react";

// Defining the delegate type
type Delegate = {
  name: string;
  credentials: string;
};

interface essentialProps {
    link: string | null;
  }

  const DelegatesComponent: React.FC<essentialProps> = ({ link }) => {
    const [initials, setInitials] = useState<string[]>([]);
    
    // Fetches the md-file and sets the initials state to the delegates in this file when the link is updated
    useEffect(() => {
        const fetchFromMarkdown = async () => {
            if (link) {
                try {
                    const response = await fetch(link);
                    const markdownContent = await response.text();
        
                    const regex = /\b[A-Z]{2,}\b(?=:)/g;
                    const matches = markdownContent.match(regex);
        
                    if (matches) {
                        // Uses a Set to ensure uniqueness
                        const uniqueInitials = Array.from(new Set(matches));
                        setInitials(uniqueInitials);
                    }
                } catch (error) {
                    console.error("Error loading Markdown file:", error);
                }
            }
        };
        
        fetchFromMarkdown();
    }, [link]); 

    // Prints the initials of the delegates when initials are updated.
    useEffect(() => {
        console.log("Initials:", initials);
    }, [initials]); 

    // Prints the name of the person clicked in the console
    const handlePersonClick = (personName: string) => {
      console.log("Clicked on person:", personName);
    };

    return (
        <div>
          <h2>
        {initials.length > 0
          ? "People"
          : "Select an MD file from the navigation bar to display the people list."}
        </h2>
          <ul>
            {DELEGATES.filter(delegate => initials.includes(delegate.credentials))
                      .map((delegate, index) => (
              <li key={index} onClick={() => handlePersonClick(delegate.credentials)}>{`${delegate.name} (${delegate.credentials})`}</li>
            ))}
          </ul>
        </div>
      );
  };
  
  export default DelegatesComponent;

// Used a python script to extract the delegates from the txt file and convert it to this format
// here is the script in case we need to update the list of delegates.

// with open('path-to-delegates.txt', 'r', encoding='utf-8') as file:
//     lines = file.readlines()

// for line in lines:
//     line = line.strip()
//     if line:
//         name, credentials = line.rsplit(' ', 1)
//         credentials = credentials[1:-1]
//         print(f"{{ name: '{name}', credentials: '{credentials}' }},")

const DELEGATES: Delegate[] = [
  { name: "Aakash Patel", credentials: "AVP" },
  { name: "Aaron Davis", credentials: "ADS" },
  { name: "Abhijith Chatra", credentials: "AC" },
  { name: "Adam Klein", credentials: "AK" },
  { name: "Adam Vandolder", credentials: "AVR" },
  { name: "Aditi Singh", credentials: "ADT" },
  { name: "Adrian Caballero", credentials: "AEC" },
  { name: "Adrian Hall", credentials: "AHL" },
  { name: "Agata Belkius", credentials: "BEL" },
  { name: "Aki Braun", credentials: "AKI" },
  { name: "Akrosh Gandhi", credentials: "AGI" },
  { name: "Alan Schmitt", credentials: "AS" },
  { name: "Alessia Bellisario", credentials: "AMB" },
  { name: "Alex Rattray", credentials: "ARY" },
  { name: "Alex Russell", credentials: "AR" },
  { name: "Alex Vincent", credentials: "AVT" },
  { name: "Alexey Shvayka", credentials: "ASH" },
  { name: "Aliaksander Palpko", credentials: "APO" },
  { name: "Alissa Renz", credentials: "ARZ" },
  { name: "Allen Wirfs-Brock", credentials: "AWB" },
  { name: "Amal Hussein", credentials: "AHN" },
  { name: "André Bargull", credentials: "ABL" },
  { name: "Andrea Bergia", credentials: "ABR" },
  { name: "Andreas Rossberg", credentials: "ARB" },
  { name: "Andreas Woess", credentials: "AWO" },
  { name: "Andres Suarez", credentials: "ASZ" },
  { name: "Andreu Botella", credentials: "ABO" },
  { name: "Andrew Branch", credentials: "ACB" },
  { name: "Andrew Brown", credentials: "ABN" },
  { name: "Andrew Burgese", credentials: "ABE" },
  { name: "Andrew Burgess", credentials: "ABS" },
  { name: "Andrew Paprocki", credentials: "API" },
  { name: "Andy Fleming", credentials: "AFG" },
  { name: "Angela Wang", credentials: "AWG" },
  { name: "Anna Henningsen", credentials: "AH" },
  { name: "Anne van Kesteren", credentials: "AVK" },
  { name: "Anthony Bullard", credentials: "ABU" },
  { name: "Armin Ronacher", credentials: "ARO" },
  { name: "Arnaud Le Hors", credentials: "ALH" },
  { name: "Arpad Borsos", credentials: "ARS" },
  { name: "Artem Kobzar", credentials: "AKR" },
  { name: "Ashley Claymore", credentials: "ACE" },
  { name: "Ashley Hauck", credentials: "AEH" },
  { name: "Ashley Williams", credentials: "AWS" },
  { name: "Asumu Takikawa", credentials: "ATA" },
  { name: "Attila Bartha", credentials: "ABA" },
  { name: "Augustus Yuan", credentials: "AYN" },
  { name: "Avik Chaudhuri", credentials: "AVC" },
  { name: "Axel Rauschmayer", credentials: "ARR" },
  { name: "Aysegul Yonet", credentials: "AYS" },
  { name: "Ben Allen", credentials: "BAN" },
  { name: "Ben Coe", credentials: "BCE" },
  { name: "Ben Lichtman", credentials: "BLN" },
  { name: "Ben Newman", credentials: "BN" },
  { name: "Ben Smith", credentials: "BS" },
  { name: "Ben Titzer", credentials: "BTR" },
  { name: "Benjamin Georges", credentials: "BGS" },
  { name: "Benoit Girard", credentials: "BGD" },
  { name: "Bernd Mathiske", credentials: "BM" },
  { name: "Bert Belder", credentials: "BBR" },
  { name: "Bill Ticehurst", credentials: "BTT" },
  { name: "Bob Myers", credentials: "RTM" },
  { name: "Boris Zbarsky", credentials: "BZ" },
  { name: "Brad Decker", credentials: "BDR" },
  { name: "Brad Green", credentials: "BG" },
  { name: "Brad Nelson", credentials: "BNN" },
  { name: "Bradford Smith", credentials: "BSH" },
  { name: "Bradley Farias", credentials: "BFS" },
  { name: "Brandon Benvie", credentials: "BB" },
  { name: "Brendan Eich", credentials: "BE" },
  { name: "Brian Douglas", credentials: "BDS" },
  { name: "Brian Kim", credentials: "BRK" },
  { name: "Brian Terlson", credentials: "BT" },
  { name: "Brian Warner", credentials: "BWR" },
  { name: "Brittany Storoz", credentials: "BSZ" },
  { name: "Bron Gondwana", credentials: "BNG" },
  { name: "Caio Gondim", credentials: "CGM" },
  { name: "Caio Lima", credentials: "CLA" },
  { name: "Cam Tenny", credentials: "CJT" },
  { name: "Caridy Patiño", credentials: "CP" },
  { name: "Caroline Cullen", credentials: "CCU" },
  { name: "Chengzhong Wu", credentials: "CZW" },
  { name: "Chip Morningstar", credentials: "CM" },
  { name: "Chris Anderson", credentials: "CAN" },
  { name: "Chris de Almeida", credentials: "CDA" },
  { name: "Chris Hyle", credentials: "CHE" },
  { name: "Chris Needham", credentials: "CNM" },
  { name: "Christian Ulbrich", credentials: "CHU" },
  { name: "Christian Wirth", credentials: "CWH" },
  { name: "Christoph Nakazawa", credentials: "CNA" },
  { name: "Christopher Blappert", credentials: "CBT" },
  { name: "Chyi Pin Lim", credentials: "LCP" },
  { name: "Clark Sampson", credentials: "CSN" },
  { name: "Claude Pache", credentials: "CPE" },
  { name: "Colin Ihrig", credentials: "CJI" },
  { name: "Conrad Watt", credentials: "CWT" },
  { name: "Conrad Watts", credentials: "CWS" },
  { name: "Corey Frang", credentials: "CF" },
  { name: "Corey Roy", credentials: "CJR" },
  { name: "Craig Cornelius", credentials: "CCN" },
  { name: "Cristian Mattarei", credentials: "CMI" },
  { name: "Dale Bustad", credentials: "DBD" },
  { name: "Damien Engels", credentials: "DES" },
  { name: "Dan Abramov", credentials: "DAV" },
  { name: "Dan Chao", credentials: "DHC" },
  { name: "Dan Clark", credentials: "DDC" },
  { name: "Dan Finlay", credentials: "DJF" },
  { name: "Dan Gohman", credentials: "DGN" },
  { name: "Dan Minor", credentials: "DLM" },
  { name: "Dan Stefan", credentials: "DAS" },
  { name: "Daniel Clifford", credentials: "DCD" },
  { name: "Daniel Ehrenberg", credentials: "DE" },
  { name: "Daniel Rosenwasser", credentials: "DRR" },
  { name: "Daniel Veditz", credentials: "DVE" },
  { name: "Daniele Bonetta", credentials: "DBA" },
  { name: "Dave Herman", credentials: "DH" },
  { name: "Dave Poole", credentials: "DMP" },
  { name: "David Enke", credentials: "DEN" },
  { name: "David Rudin", credentials: "DRN" },
  { name: "David Teller", credentials: "DTL" },
  { name: "David Turissini", credentials: "DTI" },
  { name: "David Walsh", credentials: "DJW" },
  { name: "Davidson Fellipe", credentials: "DFS" },
  { name: "Dean Tribble", credentials: "DT" },
  { name: "Devin Rousso", credentials: "DRO" },
  { name: "Diego Ferreiro Val", credentials: "DFV" },
  { name: "Dmitry Lomov", credentials: "DL" },
  { name: "Dmitry Soshnikov", credentials: "DS" },
  { name: "Domenic Denicola", credentials: "DD" },
  { name: "Doug Crockford", credentials: "DC" },
  { name: "Dr. Felienne Hermans", credentials: "FHS" },
  { name: "Duncan MacGregor", credentials: "DMM" },
  { name: "Dustin Savery", credentials: "DSY" },
  { name: "Edd Yerburgh", credentials: "EYH" },
  { name: "Edgar Barragan", credentials: "EDB" },
  { name: "Edward Yang", credentials: "EY" },
  { name: "Eemeli Aro", credentials: "EAO" },
  { name: "Emily Huynh", credentials: "EHH" },
  { name: "Eric Faust", credentials: "EFT" },
  { name: "Eric Ferraiuolo", credentials: "EF" },
  { name: "Eric Holk", credentials: "EHK" },
  { name: "Eric Leese", credentials: "ESL" },
  { name: "Eric Toth", credentials: "ET" },
  { name: "Erica Pramer", credentials: "EPR" },
  { name: "Erik Arvidsson", credentials: "EA" },
  { name: "Erik Marks", credentials: "REK" },
  { name: "Ethan Arrowood", credentials: "EAD" },
  { name: "Fabio Rocha", credentials: "FRA" },
  { name: "Federico Bucchi", credentials: "FED" },
  { name: "Felipe Balbontín", credentials: "FBN" },
  { name: "Filip Pizlo", credentials: "FP" },
  { name: "Forrest Norvell", credentials: "FN" },
  { name: "Francisco Tolmasky", credentials: "FRT" },
  { name: "Frank Yung-Fong Tang", credentials: "FYT" },
  { name: "Franziska Hinkelmann", credentials: "FHN" },
  { name: "Frederik Braun", credentials: "FDY" },
  { name: "Gabriel Isenberg", credentials: "GI" },
  { name: "Gabriel McAdams", credentials: "GMS" },
  { name: "Gary Chang", credentials: "GCG" },
  { name: "Georg Neis", credentials: "GN" },
  { name: "George Zahariev", credentials: "GKZ" },
  { name: "Godfrey Chan", credentials: "GCN" },
  { name: "Gonzalo Cordero", credentials: "GCO" },
  { name: "Gorkem Yakin", credentials: "GY" },
  { name: "Granville Schmidt", credentials: "GRS" },
  { name: "Greg Tatum", credentials: "GPT" },
  { name: "Greg Whitworth", credentials: "GCW" },
  { name: "Guanyu Liu", credentials: "LGY" },
  { name: "Guilherme Hermeto", credentials: "GHO" },
  { name: "Gus Caplan", credentials: "GCL" },
  { name: "Guy Bedford", credentials: "GB" },
  { name: "He Zhou", credentials: "HZO" },
  { name: "Hemanth HM", credentials: "HHM" },
  { name: "Henry Zhu", credentials: "HZU" },
  { name: "Holger Benl", credentials: "HBL" },
  { name: "Hubert Manilla", credentials: "HBM" },
  { name: "Hugo van der Merwe", credentials: "HUG" },
  { name: "Iain Ireland", credentials: "IID" },
  { name: "Ian Halliday", credentials: "IH" },
  { name: "Igor Minar", credentials: "IMR" },
  { name: "Ilias Tsangaris", credentials: "IT" },
  { name: "Ilya Grigorik", credentials: "IGK" },
  { name: "Ioanna M. Dimitriou H.", credentials: "IOA" },
  { name: "Isaac Durazo", credentials: "IDO" },
  { name: "Isabelle Valet-Harper", credentials: "IVH" },
  { name: "István Sebestyén", credentials: "IS" },
  { name: "Jack Steinberg", credentials: "JBS" },
  { name: "Jack Works", credentials: "JWK" },
  { name: "Jacob Groundwater", credentials: "JBG" },
  { name: "Jacob Page", credentials: "JPG" },
  { name: "Jafar Husain", credentials: "JH" },
  { name: "Jahziel Villasana", credentials: "JVA" },
  { name: "Jake Archibald", credentials: "JAD" },
  { name: "Jakob Kummerow", credentials: "JKW" },
  { name: "James Burke", credentials: "JRB" },
  { name: "James M Snell", credentials: "JSL" },
  { name: "Jamie Kyle", credentials: "JK" },
  { name: "Jamund Ferguson", credentials: "JXF" },
  { name: "Jan Olaf Martin", credentials: "JOM" },
  { name: "Jan Stola", credentials: "JSA" },
  { name: "Jason Nutter", credentials: "JAN" },
  { name: "Jason Orendorff", credentials: "JTO" },
  { name: "Jason Williams", credentials: "JWS" },
  { name: "Jason Yu", credentials: "JYU" },
  { name: "Jasvir Naga", credentials: "JNA" },
  { name: "Jaswanth Sreeram", credentials: "JS" },
  { name: "Jean-Francois Paradis", credentials: "JFP" },
  { name: "Jeff Long", credentials: "JHL" },
  { name: "Jeff Morrison", credentials: "JM" },
  { name: "Jeff Walden", credentials: "JSW" },
  { name: "Jem Young", credentials: "JZY" },
  { name: "Jenna Zeigen", credentials: "JAZ" },
  { name: "Jesse Alama", credentials: "JMN" },
  { name: "JF Bastien", credentials: "JFB" },
  { name: "Jihyeok Park", credentials: "JHP" },
  { name: "Jiming Yang", credentials: "YJM" },
  { name: "Jirka Marsik", credentials: "JMK" },
  { name: "Joe Lencioni", credentials: "JLI" },
  { name: "Joe Mordetsky", credentials: "JMY" },
  { name: "Joe Sepi", credentials: "JSI" },
  { name: "Joel Marcey", credentials: "JMA" },
  { name: "Joffrey Richten", credentials: "JRN" },
  { name: "John Buchanan", credentials: "JB" },
  { name: "John Hax", credentials: "JHX" },
  { name: "John Lenz", credentials: "JLZ" },
  { name: "John McCutchan", credentials: "JMC" },
  { name: "John Neumann", credentials: "JN" },
  { name: "John Pampuch", credentials: "JP" },
  { name: "John-David Dalton", credentials: "JDD" },
  { name: "Jonathan Dallas", credentials: "JDS" },
  { name: "Jonathan Keslin", credentials: "JKN" },
  { name: "Jonathan Kuperman", credentials: "JKP" },
  { name: "Jonathan Sampson", credentials: "JSN" },
  { name: "Jonathan Turner", credentials: "JT" },
  { name: "Jordan Gensler", credentials: "JGR" },
  { name: "Jordan Harband", credentials: "JHD" },
  { name: "Jorge Lopez", credentials: "JEL" },
  { name: "Jory Burson", credentials: "JBN" },
  { name: "Jose David Rodrigues Veloso", credentials: "JVO" },
  { name: "Josh Blaney", credentials: "JPB" },
  { name: "Joshua Peek", credentials: "JPK" },
  { name: "Joshua S. Choi", credentials: "JSC" },
  { name: "Joyee Cheung", credentials: "JCG" },
  { name: "Juan Dopazo", credentials: "JDO" },
  { name: "Julien Gilli", credentials: "JGI" },
  { name: "Justin Fagnani", credentials: "JFI" },
  { name: "Justin Grant", credentials: "JGT" },
  { name: "Justin Ridgewell", credentials: "JRL" },
  { name: "Kai Gong", credentials: "KGO" },
  { name: "Kamil Ogórek", credentials: "KOK" },
  { name: "Kat Z. Marchán", credentials: "KZM" },
  { name: "Katie Broida", credentials: "KBA" },
  { name: "Kawika Bader", credentials: "KBR" },
  { name: "Keith Cirkel", credentials: "KCL" },
  { name: "Keith Miller", credentials: "KM" },
  { name: "Kent C. Dodds", credentials: "KCD" },
  { name: "Kevin Gibbons", credentials: "KG" },
  { name: "Kevin Reid", credentials: "KR" },
  { name: "Kevin Smith", credentials: "KS" },
  { name: "Kevin Venkiteswaran", credentials: "KVN" },
  { name: "Khaidi Chu", credentials: "XAX" },
  { name: "Kirill Cherkoshin", credentials: "KCN" },
  { name: "Kris Gray", credentials: "KGY" },
  { name: "Kris Kowal", credentials: "KKL" },
  { name: "Kristen Hewell Garrett", credentials: "KHG" },
  { name: "Krzysztof Kotowicz", credentials: "KOT" },
  { name: "Kyle Barron-Kraus", credentials: "KBK" },
  { name: "Kyle Verrier", credentials: "KVR" },
  { name: "Lars Hansen", credentials: "LHN" },
  { name: "Lea Verou", credentials: "LVU" },
  { name: "Lee Byron", credentials: "LB" },
  { name: "Lei Zhao", credentials: "LZH" },
  { name: "Leland Richardson", credentials: "LM" },
  { name: "Lenz Weber-Tronic", credentials: "LWT" },
  { name: "Leo Balter", credentials: "LEO" },
  { name: "Liang Wu", credentials: "LWU" },
  { name: "Limin Zhu", credentials: "LZU" },
  { name: "Lin Clark", credentials: "LCK" },
  { name: "Linus Groh", credentials: "LGH" },
  { name: "Liu ZiJian", credentials: "LIU" },
  { name: "Logan Smyth", credentials: "LSH" },
  { name: "Long Ho", credentials: "LHO" },
  { name: "Louis Lafreniere", credentials: "LL" },
  { name: "Louis-Aimé de Fouquières", credentials: "LAF" },
  { name: "Luca Casonato", credentials: "LCA" },
  { name: "Luigi Liquori", credentials: "LLI" },
  { name: "Luis Fernando Pardo Sixtos", credentials: "LFP" },
  { name: "Lukas Stadler", credentials: "LSR" },
  { name: "Luke Hoban", credentials: "LH" },
  { name: "Lyza Gardner", credentials: "LGR" },
  { name: "Maël Nison", credentials: "MNN" },
  { name: "Maggie Pint", credentials: "MPT" },
  { name: "Manuel Jasso", credentials: "MJN" },
  { name: "Mariko Kosaka", credentials: "MKA" },
  { name: "Marja Hölttä", credentials: "MHA" },
  { name: "Mark Cohen", credentials: "MPC" },
  { name: "Mark E. Davis", credentials: "MED" },
  { name: "Mark Honenberg", credentials: "MH" },
  { name: "Mark S. Miller", credentials: "MM" },
  { name: "Mark Stacey", credentials: "MJS" },
  { name: "Markus W. Scherer", credentials: "MWS" },
  { name: "Martin Alvarez-Espinar", credentials: "MAE" },
  { name: "Mary Marchini", credentials: "MAR" },
  { name: "Masud Rahman", credentials: "MRN" },
  { name: "Mathias Bynens", credentials: "MB" },
  { name: "Mathieu Hofman", credentials: "MAH" },
  { name: "Matt Johnson", credentials: "MAJ" },
  { name: "Matt Miller", credentials: "MMR" },
  { name: "Matt Sweeney", credentials: "MS" },
  { name: "Matthew Gaudet", credentials: "MAG" },
  { name: "Mattijs Hoitink", credentials: "MHK" },
  { name: "Maxim Aleksa", credentials: "MAA" },
  { name: "Michael Ficarra", credentials: "MF" },
  { name: "Michael Fig", credentials: "MFG" },
  { name: "Michael Hablich", credentials: "MHH" },
  { name: "Michael Saboff", credentials: "MLS" },
  { name: "Michael Z Goddard", credentials: "MZG" },
  { name: "Michal Hollman", credentials: "MHN" },
  { name: "Michele Riva", credentials: "MRA" },
  { name: "Mike Murry", credentials: "MMY" },
  { name: "Mike Pennisi", credentials: "MP" },
  { name: "Mike Samuel", credentials: "MSL" },
  { name: "Mike West", credentials: "MCW" },
  { name: "Mikeal Rogers", credentials: "MRS" },
  { name: "Mikhail Barash", credentials: "MBH" },
  { name: "Miles Maltbie", credentials: "MME" },
  { name: "Min Gan", credentials: "JXZ" },
  { name: "Min-qi Wu", credentials: "MQW" },
  { name: "Ming Wang", credentials: "WMM" },
  { name: "MingYuan Cheng", credentials: "MYC" },
  { name: "Mira Gross", credentials: "MGR" },
  { name: "Miško Hevery", credentials: "MHY" },
  { name: "Mohamed Hegazy", credentials: "MDH" },
  { name: "Morgan Phillips", credentials: "MPS" },
  { name: "Mrelita Tiwari", credentials: "MTI" },
  { name: "Mu-an Chiou", credentials: "MCU" },
  { name: "Myles Borins", credentials: "MBS" },
  { name: "Myles C. Maxfield", credentials: "MCM" },
  { name: "Nagy Hostafa", credentials: "NH" },
  { name: "Nan Shang", credentials: "SNS" },
  { name: "Natalie Silvanovich", credentials: "NSH" },
  { name: "Nathan Hammond", credentials: "NHD" },
  { name: "Nebojša Ćirić", credentials: "NC" },
  { name: "Nicholas Yang", credentials: "NLY" },
  { name: "Nicolò Ribaudo", credentials: "NRO" },
  { name: "Niko Matsakis", credentials: "NM" },
  { name: "Nikolaus Papaspyrou", credentials: "NPU" },
  { name: "Noah Tye", credentials: "NTE" },
  { name: "Norbert Lindenberg", credentials: "NL" },
  { name: "Oliver Hunt", credentials: "OH" },
  { name: "Pablo Gorostiaga Belio", credentials: "PGO" },
  { name: "Paolo Severini", credentials: "PSI" },
  { name: "Patrick Soquet", credentials: "PST" },
  { name: "Paul Leather", credentials: "PLR" },
  { name: "Paul Leathers", credentials: "PL" },
  { name: "Pedram Emrouznejad", credentials: "PED" },
  { name: "Peter Frivalszky-Mayer", credentials: "PFM" },
  { name: "Peter Hoddie", credentials: "PHE" },
  { name: "Peter Jensen", credentials: "PJ" },
  { name: "Peter Klecha", credentials: "PKA" },
  { name: "Peter van der Zee", credentials: "PZE" },
  { name: "Philip Chimento", credentials: "PFC" },
  { name: "Philipp Dunkel", credentials: "PDL" },
  { name: "Philippa Gardner", credentials: "PGR" },
  { name: "Philippe Le Hégaret", credentials: "PLH" },
  { name: "Phillip Mates", credentials: "PMS" },
  { name: "Pierre-Marie Dartus", credentials: "PMD" },
  { name: "Pieter Ouwerkerk", credentials: "POK" },
  { name: "Qiang Tu", credentials: "QTU" },
  { name: "Qiuyi Zhang", credentials: "QZG" },
  { name: "Rafael Xavier", credentials: "RX" },
  { name: "Rafeal Weinstein", credentials: "RWN" },
  { name: "Randolf Jung", credentials: "JHJ" },
  { name: "Randy Luecke", credentials: "RLE" },
  { name: "Ravi Jayaramappan", credentials: "RJN" },
  { name: "Rebecca Turner", credentials: "RTR" },
  { name: "Reefath Rajali", credentials: "RRI" },
  { name: "Reid Burke", credentials: "RB" },
  { name: "Rex Jaeschke", credentials: "RJE" },
  { name: "Rezvan Mahdavi Hezaveh", credentials: "RMH" },
  { name: "Richard Gibson", credentials: "RGN" },
  { name: "Rick Button", credentials: "RBU" },
  { name: "Rick Hudson", credentials: "RH" },
  { name: "Rick Markins", credentials: "RMS" },
  { name: "Rick Waldron", credentials: "RW" },
  { name: "Riki Khorana", credentials: "RKA" },
  { name: "Rob Palmer", credentials: "RPR" },
  { name: "Robert Pamely", credentials: "RPY" },
  { name: "Robin Morisset", credentials: "RMT" },
  { name: "Robin Ricard", credentials: "RRD" },
  { name: "Rodrigo Fernandez", credentials: "ROF" },
  { name: "Romulo Cintra", credentials: "RCA" },
  { name: "Ron Buckton", credentials: "RBN" },
  { name: "Rongjian Zhang", credentials: "ZRJ" },
  { name: "Ross Kirsling", credentials: "RKG" },
  { name: "Ryuichi Hayashida", credentials: "RHA" },
  { name: "Saam Barati", credentials: "SBI" },
  { name: "Sam Goto", credentials: "SGO" },
  { name: "Sam Mussell", credentials: "SML" },
  { name: "Sam Tobin-Hochstadt", credentials: "STH" },
  { name: "Samina Husain", credentials: "SHN" },
  { name: "Sanket Joshi", credentials: "SJI" },
  { name: "Santiago Díaz", credentials: "SDZ" },
  { name: "Sarah D Onofrio", credentials: "SDO" },
  { name: "Sarah Groff Hennigh-Palermo", credentials: "SHO" },
  { name: "Sathya Gunasekasan", credentials: "SGN" },
  { name: "Satish Chondra", credentials: "SC" },
  { name: "Scott Myers", credentials: "SMS" },
  { name: "Scott Whittaker", credentials: "SWR" },
  { name: "Sean Burke", credentials: "SBE" },
  { name: "Sean Larkin", credentials: "SLN" },
  { name: "Sebastian Markbåge", credentials: "SM" },
  { name: "Sebastian McKenzie", credentials: "SMK" },
  { name: "Seo-Young Hwang", credentials: "SYH" },
  { name: "Sergey Rubanov", credentials: "SRV" },
  { name: "Seth Brenith", credentials: "SBH" },
  { name: "Seungmin An", credentials: "SAN" },
  { name: "Shaheer Shabbir", credentials: "SSR" },
  { name: "Shane Carr", credentials: "SFC" },
  { name: "Shaundai Person", credentials: "SPN" },
  { name: "Shelby Hubick", credentials: "SHK" },
  { name: "Shelley Vohr", credentials: "SVR" },
  { name: "Shi Jiang Yu", credentials: "SJY" },
  { name: "Shruti Kapoor", credentials: "SRK" },
  { name: "Shu-yu Guo", credentials: "SYG" },
  { name: "Simon Kaegi", credentials: "SK" },
  { name: "Song Yang Pu", credentials: "SYP" },
  { name: "Songfeng Li", credentials: "SLI" },
  { name: "Sora Morimoto", credentials: "SMO" },
  { name: "Sri Pillalamarri", credentials: "SPI" },
  { name: "Staffan Eketorp", credentials: "SEP" },
  { name: "Staś Małolepszy", credentials: "STM" },
  { name: "Stefan Penner", credentials: "SP" },
  { name: "Stephen Murphy", credentials: "SMY" },
  { name: "Steve Faulkner", credentials: "SFR" },
  { name: "Steven Loomis", credentials: "SRL" },
  { name: "Subo Zheng", credentials: "SZH" },
  { name: "Sukyoung Ryu", credentials: "SRU" },
  { name: "Sulekha Kulkarni", credentials: "SKI" },
  { name: "Sung-Jae Lee", credentials: "SJL" },
  { name: "Suraj Sharma", credentials: "SUS" },
  { name: "Surma", credentials: "SUR" },
  { name: "Sven Sauleau", credentials: "SSA" },
  { name: "Szabolcs Szabolcsi-Toth", credentials: "SZT" },
  { name: "Tab Atkins", credentials: "TAB" },
  { name: "Tadeu Zagallo", credentials: "TZO" },
  { name: "Takuya Kawasaki", credentials: "TKI" },
  { name: "Tantek Çelik", credentials: "TEK" },
  { name: "Tatiana Shpeisman", credentials: "TS" },
  { name: "Taylor Woll", credentials: "TW" },
  { name: "Theresa O Connor", credentials: "TOC" },
  { name: "Thomas Levy", credentials: "TLY" },
  { name: "Thomas Nattestad", credentials: "TND" },
  { name: "Thomas Wood", credentials: "TWD" },
  { name: "Tianxing Yang", credentials: "YTX" },
  { name: "Tianyang Xu", credentials: "XTY" },
  { name: "Tierney Cyren", credentials: "TCN" },
  { name: "Till Schneidereit", credentials: "TST" },
  { name: "Tim Chevalier", credentials: "TJC" },
  { name: "Tim Disney", credentials: "TD" },
  { name: "Tim McClure", credentials: "TME" },
  { name: "Timothy Gu", credentials: "TGU" },
  { name: "Tobias Koppers", credentials: "TKS" },
  { name: "Tom Care", credentials: "TC" },
  { name: "Tom Dale", credentials: "TDE" },
  { name: "Tom Kopp", credentials: "TKP" },
  { name: "Tom Van-Cutsem", credentials: "TVC" },
  { name: "Tomoki Imai", credentials: "TII" },
  { name: "Toon Verwaest", credentials: "TVT" },
  { name: "Travis Leithead", credentials: "TLD" },
  { name: "Trevor Bliss", credentials: "TBS" },
  { name: "Tyler Kellen", credentials: "TKN" },
  { name: "Tzvetan Mikov", credentials: "TMV" },
  { name: "Ujjwal Sharma", credentials: "USA" },
  { name: "Valerie Young", credentials: "VYG" },
  { name: "Victor Wang", credentials: "VWG" },
  { name: "Vladan Djeric", credentials: "VDC" },
  { name: "Vladimir Matveev", credentials: "VM" },
  { name: "Waldemar Horwat", credentials: "WH" },
  { name: "Weicheng Xie", credentials: "XWC" },
  { name: "Weijia Wang", credentials: "WWG" },
  { name: "Weiwen Liang", credentials: "LWW" },
  { name: "Weixuan Lin", credentials: "WXL" },
  { name: "Wenlu Wang", credentials: "KWL" },
  { name: "Westin Wrzesinski", credentials: "WES" },
  { name: "Whymarrh Whitby", credentials: "WWW" },
  { name: "Will Medina", credentials: "WMA" },
  { name: "Willian Martins", credentials: "WMS" },
  { name: "Xian Kun Wang", credentials: "WXK" },
  { name: "Xuan Huang", credentials: "HUX" },
  { name: "YaJu Wang", credentials: "WYJ" },
  { name: "Yan Kun Zhen", credentials: "YKZ" },
  { name: "Yang Guo", credentials: "YGO" },
  { name: "Yehuda Katz", credentials: "YK" },
  { name: "Yi Yi", credentials: "YIY" },
  { name: "Yoav Weiss", credentials: "YWS" },
  { name: "Yorkie Liu", credentials: "YKL" },
  { name: "Younies Mahmoud", credentials: "YMD" },
  { name: "Yuanrui Liang", credentials: "YRL" },
  { name: "Yuanyan Cao", credentials: "YYC" },
  { name: "YuBei Li", credentials: "YLI" },
  { name: "Yulia Startsev", credentials: "YSV" },
  { name: "Zalim Bashorov", credentials: "ZBV" },
  { name: "Zeimin Lei", credentials: "LZM" },
  { name: "Zeyu Yang", credentials: "ZYY" },
  { name: "Zhi Jie Li", credentials: "LZJ" },
  { name: "Zibi Braniecki", credentials: "ZB" },
  { name: "Zuo Jian Lin", credentials: "ZJL" },
];