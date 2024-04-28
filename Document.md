# TC39 Meeting minutes
Brage Aasen, Casper Benjamin Karlsen, Elias Hovdenes, Magnus Brørby & Vetle Knutsen


## 1 Introduction

TC39, or Technical Committee 39, is a group vital to the development of ECMAScript, the standardized scripting language widely known in its implementation as JavaScript. ECMAScript provides the core syntax and semantics for JavaScript, making TC39's work crucial for the language evolution. TC39 holds several meetings annually to discuss various matters, ensuring that JavaScript keeps pace with the web’s growth and technological advancements.

During these meetings, a stenographer transcribes the discussions. The resulting documents can be extensive, sometimes reaching nearly 200 pages, and are often in formats that are not user-friendly, posing challenges in accessibility and information sharing among committee members.

We were tasked with developing an application to simplify access to these documents and facilitate their distribution within the committee. Our solution was a front-end application primarily utilizing TypeScript within a React framework.

This document will detail our journey in front-end development, focusing on the application's coding aspects. It is based on our direct personal experiences, reflecting our individual observations, insights, and understanding. We aim to share our learnings and challenges faced during the development process, providing a window into the practical aspects of creating solutions for information management and accessibility in a technical committee setting.

## 2 Background
The TC39 committee delegates are important benefactors for the development of standardization of ECMAscript. When they are holding these meetings they are discussing matters which leads to proposals of further development. As stated earlier, the TC39 group saves everything in a GitHub repository as .md files. This is not an optimal solution for extracting information or sharing data. In this report we describe the process of finding a better solution.


We are 5 students studying Datatechnologi at UiB and our subjects mainly revolve around back-end problems so we had a lot to learn. When we first started this project we had close-to-none prior experience with developing front-end projects. The first week we spent learning React and how to create a React project. Mikhail, our advisor on this project, recommended us to use React and Electron for our application. Before the coding could begin, we needed a design to get a good view on what we were to implement. Our goal was to make the application easy and intuitive to use. The layout we came up with was a sketch of this:



The idea was an application where the user would be able to navigate through the files on the left side. The search bar on the top would provide various functionality. The selected document would appear in the middle box with the functionality to mark text and do actions with it. Alongside a box on the bottom left that contained bookmarks and favorites. Finally, an output box on the right side that printed the results from every action. The development has come a long way and there are features that we have had to change or eliminate during the process. The final product is in the picture below, the application is quite similar, but we have, for example, removed the bookmark section in favor of the navigation bar and added tabs to both the output box and document box. The navigation bar design is also different from what we initially planned. 


 
All the final functionalities will be presented in section 3 in this document.
### 2.1 Tools
#### 2.1.1 Vite:
Vite is a modern frontend development tool that significantly enhances both the performance of web applications and the developer experience. Renowned for its speed and efficiency, we've integrated it with the React framework in our projects. Vite's rapid start-up time enables swift project initialization, independent of project size. Its Instant Hot Module Replacement (HMR) feature stands out by reflecting code changes in the application promptly, without the need for reloading. This capability has streamlined our development process, maintaining the application's state and saving valuable time. Additionally, Vite's compatibility with various modern frameworks, including React, has been pivotal in our development strategy. Its developer-friendly features have not only facilitated a more efficient workflow but have also contributed to an overall reduction in development time.

#### 2.1.2 Electron:
Electron is an innovative, modern framework that enables the creation of native desktop applications. It bridges the gap between desktop and web application development. The key benefit of Electron is its cross-platform compatibility, allowing applications to run seamlessly on Windows, Linux, and MacOS. This cross-platform functionality was particularly important for our purposes. Additionally, Electron enhances user experience by transforming web applications into native apps on your device, making them more user-friendly. This is also a good way to future proof the application if we want to publish the app.

#### 2.1.3 React:
React is a front-end framework library which we used in the creation of our application. React is known for its strength in Component-Based Architecture, which allows developers to build encapsulated components. These components manage their own state, which makes it possible to build quite complex UIs. This makes it possible for us to reuse components which makes it more developer-friendly as we can reuse a lot of our components in this project. Another benefit of using React is the declarative nature, which makes the code more predictable and easier to debug. React and TypeScript can be used together and they complement each other quite well. Both React and TypeScript bring enhanced type safety, better maintainability and improved developer experience. This has worked perfectly for us when we have been developing the application. 
## 3 Functionality
We describe below the features of the application we implemented.
### 3.1 Collapse and expand tree structure file navigator


We had to come up with an intuitive way of navigating through the meetings. At first, we considered some kind of horizontal drop down menu solution where it starts with one dropdown menu. The user would be able to select which year they would like to examine and once the year has been selected, another dropdown menu would pop up containing the months. Again, once a specific month would be selected, yet another menu would pop up, and so on. This solution worked but it was way too cumbersome. The current solution uses a tree structure navigation tab implemented with “TreeView” from the MUI library. Here the user has a good overview of all the files and does not have to start over again in order to search a file that is not in the same year. 

This solution has a collapse and expand mechanism giving the ability to navigate freely. 






###  3.2 Tabs & Sub-tabs

We wanted the user to have multiple chosen meetings easily available so that they do not have to remember which files they were searching through. We solved this by implementing a tabs solution. This way a tab gets initialized in the left box beneath the search bar when the user clicks on the meeting they want to examine. This stays in the tabs overview until the user clicks on the close-button beside it. Here’s how it looks:



In addition to these tabs, we needed an overview of the functionalities initialized to each file. When the user has one file open and would like to use functionalities for that specific file, like (we will get back to these features soon): topics, participants, sentiment, etc.. The output, and tools related to that feature will pop up in a new subtab in the right box beneath the search bar. This functions as some sort of a child to the file-tab that the user is currently on. Meaning that when opening another file tab, the subtabs related to the previous file-tab will go out of sight and reappear again once that specific file is open again.

Here is what the tabs and subtabs look like while “2013-03/MAR-12.MD” is opened and we are using the participants and topics tab:



And here is what it looks like while “2013-01/JAN-29.MD” is opened where we have only utilized the sentiment functionality:



This implementation allows the user to keep its workspace clean. Because each file won’t have every feature tab / subtab open while also allowing the user full functionality if wanted.
### 3.3 Toolbar (Search bar)

Since there are a lot of different functionalities in this application, we had to construct something that handled all of them in a clear way. The answer was a Toolbar which looks like a search bar at the top of the application. When the user clicks on this Toolbar, a menu appears. This menu shows them everything they can do to study the files presented to them in the left box. The menu will appear as a list where they are able to choose the desired functionality by clicking on them. They must have already selected a file in advance of course and as they click on the desired functionality, it will pop up as a sub tab in the right box like mentioned in the previous feature. There are some functionalities however that depart from this way of execution which are the sentiment and chatGPT features and this will be specified later in their respective topic. 

It is also worth mentioning that the user has the privilege to search for the feature they would like to use.

A screenshot of the Toolbar:



### 3.4 Participants overview and search

The application needed a way to tell who was participating in the currently open file. There is already a list on top of each file that is supposed to do that, but apparently the list is incorrect and is just mentioning a bunch of semi-relevant people. So we had to bring up a solution that gave the user the correct list of people participating in the meeting and alongside some functionality to really understand what these people are talking about.

So the solution is to go through the file and pick up whenever there is a person talking and pick up their initials. Then use those initials to match with the name in a file “delegates.txt” Which is a list of everyone ever participated in the meetings containing their name and initials, and then store all of these matches in a list which is presented to the user in the right box when you click on the “Participants” function in the toolbar. 

We implemented an additional feature. With the correct list now in front of the user, they are able to click on the participant they want to study more and as they do that, everything that person has said in that meeting will be printed in the right box. When you have had enough of that person’s talking, they simply press the exit button at the top right corner.

Here is an example of finding out everything that Alex Russell (AR) have said this meeting:



### 3.5 Topics overview, scroll and highlight

The Topics feature is very much the same as participants, but for topics instead, and the implementation is a bit different. Here the user will get a clear view on every topic in the meeting in chronological order and they will also be able to click on the topics. When they do that, the left box will scroll to exactly where the topic is in the file and it will also highlight the topic with a neat animation to ensure that they are right where they want to be. 

Here is a screenshot of where we have clicked on the topic “Adoption of Agenda” in the right box which resulted in the left box scrolling down to that point in the file and highlighting the topic with a red underscore:



### 3.6 Search in file

This is a file management application, so, of course we have not forgotten to implement a way of searching through the documents. This is much like a “ctr + f” function that search through the current document and the user can navigate back and forth to everything in the file that matches their search. Here is a guide on how it works:

Open the document you would like to study, click on the Toolbar and select “Search in file”. This will generate a file search subtab in the right box containing the search bar with some buttons and the file in raw text underneath. The way of searching is very intuitive, you simply type what you would like to search for and press the “Search”-button afterwards. This will scroll down to the first match in the file. There are also two additional buttons: “Prev” and “Next” that navigate you back and forth between the search matches in the file.

We would like to mention that this is not the ideal implementation. We did actually try to implement a more neat and intuitive way of searching by simply typing what the user would like to search for in the Toolbar and selecting “search in file” as the option which would then scroll down to the match in the left box and highlight it in the same way as in topics. But for some reason, this was very hard. After a few weeks of trying to implement this rather simple solution, we figured we had to come up with a somewhat alternative feature that is doing the same job but in a less satisfying way.

### 3.7 Sentiment 

As another way of analyzing what's being said in the files and furthermore understand the finer feelings of the statements in a more precise and formal way, we’ve implemented “Sentiment”. This functionality allows the user to get a clear view on whether what someone has said is either a negative, neutral or positive expression. They will be presented with three different charts. A bar chart, a pie chart and a line chart to really give them everything they need for a better understanding. 

The way of execution differs a little from the other features in the Toolbar. Here the user will have to mark the text that they would like to analyze in advance before they click on the “Sentiment” selection in the Toolbar. 
That is when these tabs show up:



### 3.8 Link engineering

You may have noticed all the Links at the top of each subtab. This link has a purpose of making it possible to share the user’s discoveries in the ocean of Tc39 md-files with other people. To use it, The user simply copies the link and sends it to their friend, they will then have to insert the link into their Toolbar and select “Execute link”. This will direct them straight to the point where the file and subtab are identical for both users. Instead of wasting a lot of time telling their friend where to navigate and what to click on etc. They can now use that time to discuss their discoveries. 

The link does however not work on all the features yet. Features where the user would have to share what text they marked, like in sentiment or chatGPT outputs are not yet possible to share with the link, we have struggled a lot to make it work but with no prevail. So we would suggest implementing this functionality in future development due to its great functionality and convenience. 
### 3.9 ChatGPT search and commands

One of the innovative features in this application is the direct integration of the chatGPT API, which enhances user interaction by enabling real-time conversations with chatGPT. Users can now highlight text they wish to process—such as summarizing or analyzing—and use the toolbar to initiate commands like "Summarize this" or "Analyze argument types." The results from chatGPT are displayed in a subtab immediately following the command. Additionally, users can input their own queries directly into the toolbar and select "Search with chatGPT" to receive responses without leaving the application. This process ensures a streamlined and efficient user experience.



We consider this as a practical tool to enhance the understanding of what’s being told by making room for discussion and help from artificial intelligence. 
### 3.10 dark mode

For everyone putting in long hours on this application, we've introduced a Dark Mode option to make your experience less tiring. If you find the default bright background too harsh, you can switch to Dark Mode with a simple click on the toggle at the top left corner of the app. This should help ease the strain on your eyes during extended use.

Here’s a screenshot of the dark mode while activated:



## 4 Architecture of the solution
### 4.1  What is the solution made with?

Our application makes use of the Electron framework, with a combination of both TypeScript, React and Python. Electron is used to handle the native desktop environment, TypeScript is integrated to add type-checking, React is used to build the user interface, and lastly, Python is used to perform simple scripts and handle specific installed packages such as sentiment natural language processing (NLP).

### 4.2 High-Level Architecture Overview



The main structure of the application is centered around the App component. This component serves as the root of the program, and is responsible for handling the primary components of the application.


### 4.3 Component Hierarchy and Data Flow

The root component, App, acts as a container for the other main components such as ChatComponent, NavBarComponent and TabsComponent. These components are nested and communicate between each other to provide the application with its central functionality. Each component in the application has its own specific role, and they all work together to provide a cohesive experience for the user.

```ts
import ...

const App = () => {
  const [hashTable, setHashTable] = useState({});
  const { theme, themeMode, toggleThemeMode } = useThemeMode();

  // Load the hashtable (Navigation table) on launch
  useEffect(() => {
    const loadHashTable = async () => {
      const table = await fetchHashTable();
      setHashTable(table);
    };
    loadHashTable();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TextHighlightProvider>
        <SelectedTextProvider>
          <SelectionProvider>
            {" "}
            {/* This provides selection state context */}
            <FormGroup
              row
              sx={{
                justifyContent: "flex-start",
                marginLeft: 3,
                marginTop: "-1%",
              }}
            >
              <ThemeSwitcher
                themeMode={themeMode}
                toggleThemeMode={toggleThemeMode}
              />
            </FormGroup>
            <NavBarComponent hashTable={hashTable} />
            <ChatComponent isLoading={false} />
          </SelectionProvider>
        </SelectedTextProvider>
      </TextHighlightProvider>
    </ThemeProvider>
  );
};

export default App;
```

The state of the program is managed using React’s hook and context system, the context system is used to pass data through the component tree without having to pass props down manually at every level. This for example enables the different parts of the program to change, and make use of the current selected text by a user. Custom hooks such as useThemeMode and useSelection are used to manage state and logic. These hooks simplify the components by abstracting complex functions and provide a way to reuse stateful logic across the different components in a simple manner.

Example of context of the currently selected text:
```ts
import React, { createContext, useState, useContext, ReactNode } from "react";

interface SelectedTextContextType {
  selectedText: string;
  setSelectedText: React.Dispatch<React.SetStateAction<string>>;
}

const defaultState: SelectedTextContextType = {
  selectedText: "",
  setSelectedText: () => {},
};

const SelectedTextContext =
  createContext<SelectedTextContextType>(defaultState);

interface SelectedTextProviderProps {
  children: ReactNode; // This line defines the type for children
}

export const SelectedTextProvider: React.FC<SelectedTextProviderProps> = ({
  children,
}) => {
  const [selectedText, setSelectedText] = useState("");

  return (
    <SelectedTextContext.Provider value={{ selectedText, setSelectedText }}>
      {children}
    </SelectedTextContext.Provider>
  );
};

export const useSelectedText = () => useContext(SelectedTextContext);
```



As you can see in the provided class diagram, the components are structured as a tree, and are modulated such that each component is either using, or being used by another for a specific purpose.

The application is modulated to conform to the single responsibility principle, and uses inheritance to make use of one another’s functionality, in the different parts of the program. This enhances the code readability and maintainability, such that future further changes and additions will be unproblematic to implement.

### 4.4 Communication Layer

The frontend and backend communicate using interprocess message passing with node-ipc. This type of message passing allows for async and event-based communication to take place. By using ipc message passing, the application can communicate between the main process and the renderer process, and perform tasks without exposing the entire Node.js API to the renderer process. An example of this is the fetching and sorting of meeting notes. In the root component, App, there is a useEffect hook that loads the meeting notes by an await call to the fetchHashTable() method defined in FetchMeetings.

```ts
export const fetchHashTable = async () => {
  const basePath = "public/meetings/"; // Hard-coded base path
  try {
    const response = await window.electronAPI.fetchHashTable(basePath);
    return response;
  } catch (error) {
    console.error("Failed to fetch hash table:", error);
    throw error;
  }
};
```

This component tries to await a response through the window.electronAPI which returns the fully sorted dictionary by a call to electronAPI.fetchHashTable(basePath) defined in the preload file. Preload is a file that is loaded before the renderer process, and is able to access both the Node.js environment and the DOM API’s. The use case of this file is to expose a safe, controlled subset of the Node.js and Electron API’s to the renderer process (which for security reasons does not have direct access to Node.js API’s)


The electronAPI is a custom context bridge which is created in the preload and is defined as such:

```ts
const { contextBridge, ipcRenderer } = require("electron");

// For dynamic fetch of meetings
contextBridge.exposeInMainWorld(
  "electronAPI",
  {
    fetchHashTable: () => {
      const basePath = "public/meetings/"; // Hard-code the base path here
      return ipcRenderer.invoke("read-directory", basePath);
    },
  }
);

...

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", withPrototype(ipcRenderer));
```

The method call "fetchHashTable" returns and invokes a call to the ipcRenderer “read-directory”, which is defined in the main process (main.ts). This allows the program to make use of the file system and perform previously dangerous operations in a safe environment, and return it back to the respective component in the renderer process that invoked the call.

main.ts:
```ts
const fs = require("fs").promises;
// Handle read-directory event
ipcMain.handle("read-directory", async (_event, basePath) => {
	// Implementation
});
```

The application makes use of the ipc message passing both for the fetching of meeting notes / generation of dictionary, and performing sentiment analysis by spawning python scripts:

main.ts:
```ts
  ipcMain.on("performSentimentAnalysis", (event, arg) => {
    console.log(`Received text for analysis: ${arg}`); // Debug log
    const pythonProcess = spawn("python3", [
      "src/renderer/scripts/sentiment_analysis.py",
      arg,
    ]);
    pythonProcess.stdout.on("data", (data) => {
      console.log(`Analysis result: ${data}`); // Debug log
      event.reply("sentimentAnalysisResult", data.toString());
    });
    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("error", (error) => {
      console.error(`Failed to start subprocess: ${error}`);
    });
  });
}
```



## 5 Development Strategy
### 5.1 How We Built Our App
How did we manage our app project? We kept things pretty organized but flexible, using what’s known as Scrum to keep on track without losing our minds. Here’s a rundown of how our team of five made it all happen, meeting by meeting, sprint by sprint.
### 5.2 Going Agile with Scrum and Sprints
First up, let’s talk about structure. We broke our work down into chunks called sprints, each lasting about two weeks until our next catch-up with Mikhail, our project guide. This wasn't just about making deadlines; it was about setting clear, achievable goals and knocking them out one by one.

At the start of each sprint, we would gather around our Trello board—our Kanban-style command center. Here, we would move tasks around from 'To Do', to 'In Progress', to 'Done'. It was a great visual cue for where things stood and kept everyone on the same page.

### 5.3 Bi-Weekly Brainstorms with Mikhail
About every second week, we would meet up with Mikhail. We would go over what we managed to get done, show off our latest bits of finished work, and then get some real-time feedback. It was super helpful to have that external perspective, plus it kept us motivated.

After showing off our progress, we would come to an agreement on what’s next and what should be prioritized. This way we had a good game plan for the upcoming sprint and we added this onto our Trello board. That way, we would all go from the meeting knowing exactly what we needed to work on next.

### 5.4 Communication and Collaboration Tools
For our team to be on the same page when communicating, we used Discord for day-to-day chatting and quick updates. It helped us stay connected if one of us did not meet up in person. For more formal or detailed discussions, we would meet in person. This mix of digital and face-to-face communication ensured that no one was ever out of the loop.

We also relied on Git for version control. This was crucial as it allowed us to work on different parts of the project simultaneously without interfering with each other. Everyone could push their updates without disrupting the workflow, making our development process smooth and continuous.

### 5.5 Pair Programming to the Rescue
Now, for the tricky bits, like when we ran into a merge conflict that interfered with previous features. Or a particularly hard code issue we would pair up. Pair programming was our secret weapon. We experienced that two heads were better than one, solving hard problems together and learning from each other in the process.

### 5.6 Conclusion
All this planning, sprinting, and pairing really paid off. Keeping things casual but clear with regular updates and lots of teamwork really helped us develop our application. Our method kept everyone in the loop and moving forward together. It was about making sure we all knew where we were headed.

Using Scrum, sticking to our sprints, employing modern tools like Discord and Git for communication and version control, and getting our hands dirty with pair programming made the whole journey a great learning experience. That’s how we did it—teamwork, planning, and a whole lot of hard work.


## 6 Difficulties and Learning Outcome
### 6.1 OpenAI key leak
The first problem we encountered and actually the first thing we tried was adding the ChatGPT API to the application. This was actually a quite easy process, as OpenAI has a guide on how to do this. However, after it was implemented, we encountered a problem when pushing to GitHub. The OpenAI key, which is used for accessing the API, was deactivated. This is because OpenAI has their own mechanism to detect leaked keys. Since we tried to upload the code with the key to GitHub, OpenAI detected it as leaked and therefore deactivated it. Thankfully this mechanism exists, as the key could have been abused by others. We ended up with a solution to have an example file called “.env_sample.txt”, where the user has to put in their own key and then rename the file to “.env” and then automatically hidden in “.gitignore”. This problem gave us a quick lesson in data security and to not publicly share private keys. 
### 6.2 GitHub Fetching
The second problem we encountered was git fetching. The initial thought was to fetch the meeting files from github when booting the application. This would mean that the application would retrieve new files if the committee held a new meeting. However, we encountered an issue where github would block our fetch, because we were fetching too many times. This is a protective mechanism from git to mitigate excessive requests which might have an impact on GitHub’s servers. So we learned that there are some potential limitations regarding external API’s. We came to the solution to just add all of the MD files into our project locally.  
### 6.3 Cost of API
After a bit of testing, we found out that the ChatGPT API might be a bit expensive. For a request with an input of 500 words and an output of 1000 words, it would cost approximately 1kr. After a month or so of working on the project, OpenAI lowered the cost for the GPT 3.5 API, meaning the same request as before would now cost 0.02kr. This means the cost is practically free for a modest use. We learned that using external API’s is usually not free and that it is important to stay updated on the tools we use. 
### 6.4 Scroll Position Error
Next, we encountered an interesting issue when a meeting file was opened and scrolled down: if another md file was then opened, it would start at the same scroll position as the previous file. We wanted each new md file to open at the top. To address this, we created a method called "ScrollTo" intended to scroll to the desired location. However, this method did not work as expected because it used the headlines of the md files for navigation. This led to a problem where the headline appeared under the meeting file tabs. To resolve the issue, we had to restructure and put the meeting file tabs inside its own paper and above the meeting files themselves. Initially, we thought we had a simple solution to this problem, but unfortunately, it turned out to be more complex than anticipated.
### 6.5 Dark & Light Mode 
We had implemented dark mode and light mode; we chose to implement this feature because it's nice to be able to customize the application as it suits the user. This was a feature which we quickly regretted adding. Whenever we added something to the layout or changed the color of something, we always had an issue in either dark or light mode. Some of us only use light mode, and some only use dark mode. Whenever a new feature was implemented, we only checked the mode we used to see if everything was fine. This led to a lot of visual bugs where something would only work in one of the modes. If we were going to build something new we would maybe have chosen to not implement dark/light mode, at least not as early in the development, as it just creates more work when developing.
### 6.6 Handling Path Differences on Different Operating Systems
Towards the end of the project, we noticed a small error. For those of us using MacOS, a meeting file tab’s name could be “2016-03/MARCH-30.md”, which is correct. But, on Windows, it would show as “public\meetings\2016-03\MARCH-30.md”. This error happened because we tried to replace “public/meetings/” with an empty string to remove it, which worked on MacOS. However, windows uses backslashes for file paths where MacOS uses forward slashes, meaning it would not work on windows. So, we learned that we need to take into consideration that people use different operating systems and therefore have different needs. 
### 6.7 Merge conflicts
At last, a problem that is hard to avoid, is merge conflicts. This wasn’t really a problem in the start, but it happened a lot in the end. The cause for this was that some of us were refactoring the application and split files into smaller files and folders, while others were working on new functionality. So the problem occurred when the refactoring was merged and it was time for the new functionality to be merged. Since files had been moved and changed, we had to solve merge conflicts, which took some time. If we were to go back in time, we would have done the refactoring before any new implementations. 


## 7 Discussion(Further development)
### 7.1 Better search in document
The current application lacks an optimal solution for the "search in file" feature, particularly when searching within markdown files. As a temporary workaround, we have converted markdown files to plain text files. Although this method is functional, it is not ideal. Enabling direct search capabilities within markdown files would be beneficial for both the appearance and usability of the application. Addressing this limitation should be a priority for future development to improve user experience.

### 7.2 Dynamic fetch
As of now the md files are stored locally in the repository, this comes from the github fetch issue. This means that if the tc39 committee holds a new meeting the repository will not update with the new documentation. It would be quite beneficial for the application to be able to dynamically fetch the meetings such that the files are always up to date. 

### 7.3 ChatGPT API key
In our application, to use ChatGPT, the user needs to add their own ChatGPT API key manually in the code. For the user to have a better user experience, a better way to add their own ChatGPT API key would be to let the user insert their own ChatGPT API key in the search bar.


### 7.4 More pre-made prompts
As of now we have 2 pre-made prompts for chat gpt. They are quite useful, and make it easy for the user to use ChatGPT. More pre-made prompts would be good. There is no way to add or remove pre-made prompts so a feature where the user could add or remove this would be good for the application.

### 7.5 Data security 
Data security has not been a primary focus during our development. Consequently, a thorough analysis of security requirements needs to be done before deployment. This includes safe key storage, as well as taint checking to ensure integrity and confidentiality of data processed through the OpenAI API. 

