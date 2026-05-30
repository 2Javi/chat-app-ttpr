using UnityEngine;

public class RepeatRoad : MonoBehaviour
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    public float speed = 10f;
    public float resetZ = -20f;
    public float spawnZ = 20f;
    public GameObject[] obstaclePrefabs;
    public float[] laneX = { -2.5f, -1.5f, -0.5f, 0.5f, 1.5f, 2.5f };
    public float spawnInterval = 1.5f;
    public float obstacleSpawnZ = 30f;

    private float spawnTimer;


    void Update()
    {
        transform.position += Vector3.back * speed * Time.deltaTime;

        if (transform.position.z < resetZ)
            transform.position = new Vector3(0, 0, spawnZ);

        spawnTimer -= Time.deltaTime;
        if (spawnTimer <= 0f)
        {
            SpawnObstacle();
            spawnTimer = spawnInterval;
        }
    }

    void SpawnObstacle()
    {
        if (obstaclePrefabs.Length == 0) return;

        GameObject prefab = obstaclePrefabs[Random.Range(0, obstaclePrefabs.Length)];
        float x = laneX[Random.Range(0, laneX.Length)];
        Instantiate(prefab, new Vector3(x, 0, obstacleSpawnZ), Quaternion.Euler(0, 180, 0));
    }
}