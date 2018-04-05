from numpy import genfromtxt
from scipy.spatial.distance import sqeuclidean
from scipy.spatial.distance import cosine
from scipy.spatial.distance import minkowski
from scipy.spatial.distance import cityblock
import numpy as np

def similarity(filename):
    X = genfromtxt(filename, delimiter=',')
    num_features = len(X[0])
    man_dist = [cityblock(features, np.zeros(num_features)) for features in X]
    cosine_dist = [cosine(features, np.ones(num_features)) for features in X]
    euclid_dist = [sqeuclidean(features, np.zeros(num_features)) for features in X]
    minkowski_dist = [minkowski(features, np.zeros(num_features), 2) for features in X]
    np.savetxt('man_dist_' + filename + '.csv', man_dist, fmt='%i', delimiter=',')
    np.savetxt('cosine_dist_' + filename + '.csv', cosine_dist, fmt='%i', delimiter=',')
    np.savetxt('euclid_dist_' + filename + '.csv', euclid_dist, fmt='%i', delimiter=',')
    np.savetxt('minkowski_dist_' + filename + '.csv', minkowski_dist, fmt='%i', delimiter=',')

similarity()