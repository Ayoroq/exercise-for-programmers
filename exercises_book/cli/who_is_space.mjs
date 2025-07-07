// function to get the data with the api call
async function getAstronauts() {
  try {
    const url = "http://api.open-notify.org/astros.json";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    return { count: data.number, astronauts: data.people };
  } catch (error) {
    console.error("Failed to fetch astronaut data:", error);
    // Return a default/empty structure to prevent crashes downstream
    return { count: 0, astronauts: [] };
  }
}

// function to get the values for the longest names and longest craft name
function getLongestValues(data) {
  const {count, astronauts} = data;
  let longestName = 0;
  let longestCraftName = 0;
  astronauts.forEach((astronaut) => {
    if (astronaut.name.length > longestName) {
      longestName = astronaut.name.length;
    }
    if (astronaut.craft.length > longestCraftName) {
      longestCraftName = astronaut.craft.length;
    }
  });
  return { longestName, longestCraftName };
}

// function to group the users by craft
function groupUsers(data) {
  const { count, astronauts } = data;
  const groupedUsers = Object.groupBy(astronauts, (people) => people.craft);
  return groupedUsers;
}

// function to return the sorted users
function sortGroupedUsers(groupedUsers) {
  const sortedUsers = {};
  for (const [craft, people] of Object.entries(groupedUsers)) {
    sortedUsers[craft] = people.sort((a, b) => {
      const lastA = a.name.split(" ").at(-1);
      const lastB = b.name.split(" ").at(-1);
      return lastA.localeCompare(lastB);
    });
  }
  return sortedUsers;
}

// function to print information about the users
function printUsers(data) {
  const { longestName, longestCraftName } = getLongestValues(data);
  const groupedUsers = groupUsers(data);
  const sortedUsers = sortGroupedUsers(groupedUsers);
  console.log(`${"Name".padEnd(longestName)} | ${"Craft".padEnd(longestCraftName)}`);
  console.log("-".repeat(longestName + longestCraftName + 4));
  Object.entries(sortedUsers).forEach(([craft, people]) => {
    for (const person of people) {
      const nameCell = person.name.padEnd(longestName);
      // Only print craft for the first person in the group
      const craftCell = people[0] === person ? craft.padEnd(longestCraftName) : " ".padEnd(longestCraftName);
      console.log(`${nameCell} | ${craftCell}`);
    }
  });
  console.log("\n");
}

// main function to run the code
async function main() {
  try {
    const data = await getAstronauts();
    if (data.count > 0) {
      console.log(`\nThere are ${data.count} astronauts in space right now:\n`);
      printUsers(data);
    } else {
      console.log("Could not retrieve astronaut information or no one is in space.");
    }
  } catch (error) {
    console.error("An error occurred in the main application:", error);
  }
}

// call the main function
main();
