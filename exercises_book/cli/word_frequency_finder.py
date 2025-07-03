import re
import matplotlib.pyplot as plt
file_path = '../files/macbeth.txt'  # Path to the input text file
import time

# Reading the file and returning its content as a single string
def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        content = content.replace('\n', ' ')  # Replace newlines with spaces
    return content

# Remove punctuation from the text and convert all words to lowercase
def remove_punctuation(text):
   edited_text = re.sub(r"[.,?!]", "", text)  # Remove specified punctuation
   edited_text = edited_text.split(' ')       # Split text into words
   edited_text = list(filter(None,edited_text))  # Remove empty strings
   edited_text = [word.lower() for word in edited_text]  # Convert to lowercase
   return edited_text

# Count the frequency of each word and return a sorted dictionary (descending by frequency)
def create_sort_dict(array):
    words_freq = {}
    for word in array:
        if word in words_freq:
            words_freq[word] += 1
        else:
            words_freq[word] = 1
    # Sort the dictionary by frequency in descending order
    sorted_words_freq = dict(sorted(words_freq.items(), key=lambda item: item[1], reverse=True))
    return sorted_words_freq

# Print the histogram: word followed by asterisks representing frequency
def show_result(dict):
    for key, value in dict.items():
        print(f'{key.ljust(10, " ")} : {"*"*value}')

# Plot a horizontal bar chart of the top N word frequencies using matplotlib
def plot_histogram(freq_dict, top_n=10):
    words = list(freq_dict.keys())[:top_n]      # Get top N words
    counts = list(freq_dict.values())[:top_n]   # Get their counts
    plt.barh(words[::-1], counts[::-1], color="skyblue")  # Plot in reverse for highest at top
    plt.xlabel("Frequency")
    plt.title(f"Top {top_n} Word Frequencies")
    plt.tight_layout()
    plt.show()

# Main function to coordinate reading, processing, displaying, and timing
def main():
    start_time = time.time()  # Start timing
    words = read_file(file_path)              # Read the file
    words = remove_punctuation(words)         # Clean and split into words
    words_freq = create_sort_dict(words)      # Count and sort frequencies
    show_result(words_freq)                   # Print the histogram to the console
    end_time = time.time() 
    elapsed_time = (end_time - start_time) * 1000  # Calculate elapsed time in ms
    print(f"Execution time: {elapsed_time:.2f} ms")
    plot_histogram(words_freq)                # Show graphical bar chart

main()  # Run the program