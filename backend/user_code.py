arr = []
for _ in range(5):
    arr.append(int(input()))

max_val = arr[0]  # Initialize max to the first element
for num in arr[1:]:
    if num > max_val:
        max_val = num  # Update max if the current element is larger

print(max_val)  # Output the maximum value