from numpy import genfromtxt
from scipy.spatial.distance import sqeuclidean
from scipy.spatial.distance import cosine
from scipy.spatial.distance import minkowski
from scipy.spatial.distance import cityblock
import numpy as np

def similarity(filename, num_features):
    X = genfromtxt(filename, delimiter=',')
    print(len(X))
    man_dist = [cityblock(features, np.zeros(num_features)) for features in X]
    cosine_dist = [cosine(features, np.ones(num_features)) for features in X]
    euclid_dist = [sqeuclidean(features, np.zeros(num_features)) for features in X]
    minkowski_dist = [minkowski(features, np.zeros(num_features), 2) for features in X]
    np.savetxt('man_dist_' + str(num_features) + 'features.csv', man_dist, fmt='%5f', delimiter=',')
    np.savetxt('cosine_dist_' + str(num_features) + 'features.csv', cosine_dist, fmt='%5f', delimiter=',')
    np.savetxt('euclid_dist_' + str(num_features) + 'features.csv', euclid_dist, fmt='%5f', delimiter=',')
    np.savetxt('minkowski_dist_' + str(num_features) + 'features.csv', minkowski_dist, fmt='%5f', delimiter=',')

similarity('features_4_classes.csv', 10)
