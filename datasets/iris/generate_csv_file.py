import numpy as np

# takes filenames of data, creates a csv file of the data
def create_csv_file(probabilities_csv, actual_class_csv, predicted_class_csv, features_csv, distances_csv, output_fname, multilabel=False):
    probabilities = np.genfromtxt(probabilities_csv, delimiter=',')
    actual_class = np.genfromtxt(actual_class_csv, delimiter=',')
    predicted_class = np.genfromtxt(predicted_class_csv, delimiter=',')
    features = np.genfromtxt(features_csv, delimiter=',')
    distances = np.genfromtxt(distances_csv, delimiter=',')
    if not multilabel:
        actual_class = vectorize(actual_class, len(probabilities[0]))
        predicted_class = vectorize(predicted_class, len(probabilities[0]))

    assert len(actual_class[0]) == len(probabilities[0]), "Number of classes does not match number of predicted probabilities"
    assert len(predicted_class[0]) == len(probabilities[0]), "Number of classes does not match number of predicted probabilities"

    dataset = concatenate_data(probabilities, actual_class, predicted_class, features, distances, multilabel)
    print (dataset[0])

    num_features = len(features[0])
    num_classes = len(probabilities[0])

    generate_csv(output_fname, dataset, num_classes, num_features)

def vectorize(y, num_classes):
    y = y.astype(int)
    y = y.tolist()
    #print y
    for example in range(len(y)):
        actual_class = y[example]
        y[example] = [0]*num_classes
        y[example][actual_class] = 1
    return y


# takes numpy arrays,  concatenated numpy array
def concatenate_data(probabilities, actual_class, predicted_class, features, distances, multilabel=False):
    #concatanate the arrays
    return np.column_stack((np.column_stack((np.column_stack((np.column_stack((probabilities, actual_class)), predicted_class)), features)), distances))

def generate_csv(output_fname, dataset, num_classes, num_features):
    column_fmt = []
    column_fmt += (['%5f']*num_classes)
    column_fmt += (['%i']*2*num_classes)
    column_fmt += (['%5f']*num_features)
    column_fmt += (['%5f']*4)

    assert len(column_fmt) == len(dataset[0]), "Format of columns does not match number of columns"

    generated_header = generate_header(num_classes, num_features)

    # assert len(header) == len(dataset[0]), "Header length does not match number of columns"
    # dataset = np.vstack((generated_header,dataset)) #add header to beginning of dataset

    np.savetxt(output_fname+'.csv', dataset, fmt=column_fmt, delimiter=',', header=generated_header)


def generate_header(num_classes, num_features):
    header = ""
    texts = ['prob', 'actual', 'predicted', 'feature']
    distances = ["distance_man", "distance_cosine", "distance_euclidean", "distance_minkowski"]
    for text in texts:
        if text == 'feature':
            for i in range(num_features):
                header += text + str(i) + ','
        else:
            for i in range(num_classes):
                header += text + str(i) + ','
    for dist in distances:
        header += dist + ","
    return header

def find_file(filename, rootdir):
    import os
    for dirpath, _, filenames in os.walk(rootdir):
        if filename in filenames:
            return os.path.join(dirpath, filename)


create_csv_file("iris_prob.csv",
"iris_target.csv",
"iris_predicted.csv",
"iris_data.csv",
"distance_iris_data.csv",
"iris_random_forest")

create_csv_file("iris_prob_svm.csv",
"iris_target.csv",
"iris_predicted_svm.csv",
"iris_data.csv",
"distance_iris_data.csv",
"iris_svm")

create_csv_file("iris_prob_kneigh.csv",
"iris_target.csv",
"iris_predicted_kneigh.csv",
"iris_data.csv",
"distance_iris_data.csv",
"iris_kneigh")

#if __name__ == '__main__':
#    # Locate data files
#    output_fname = input("Enter name for dataset: ")
#    probabilities_csv = input("Enter path to probability data file: ")
#    actual_class_csv = input("Enter path to target class data file: ")
#    predicted_class_csv = input("Ener path to predicted class data file: ")
#    features_csv = input("Enter path to examples data file: ")
#    generate_csv(output_fname, probabilities_csv, actual_class_csv, predicted_class_csv, features_csv)
