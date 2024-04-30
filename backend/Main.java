import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        try {
            int[] array = new int[5];
            for (int i = 0; i < 5; i++) {
                array[i] = scanner.nextInt();
            }

            int largest = array[0];
            for (int i = 1; i < 5; i++) {
                if (array[i] > largest) {
                    largest = array[i];
                }
            }

            System.out.println(largest);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            scanner.close();
        }
    }
}