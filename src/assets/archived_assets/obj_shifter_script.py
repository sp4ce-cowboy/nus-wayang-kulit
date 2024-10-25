# shift_obj.py

def shift_vertices(input_file, output_file, shift_x=-3, shift_y=4, shift_z=0):
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        for line in infile:
            # Check if the line defines a vertex
            if line.startswith('v '):
                # Split the line into components
                parts = line.strip().split()
                x = float(parts[1]) + shift_x
                y = float(parts[2]) + shift_y
                z = float(parts[3]) + shift_z
                # Write the shifted vertex back to the output file
                outfile.write(f"v {x} {y} {z}\n")
            else:
                # Write other lines without modification
                outfile.write(line)

# Example usage
shift_vertices('puppet.obj', 'shifted_puppet.obj')
