using UnityEngine;

public class RepeatRoad : MonoBehaviour
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    public float speed = 10f;
    public float resetZ = -20f;
    public float spawnZ = 20f;
    public GameObject[] obstaclePrefabs;
    // [SerializeField] float lane0 = -24f, lane1 = 
    public float spawnInterval = 0.5f;
    public float obstacleSpawnZ = 1f;
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
        float x = Random.Range(-24, 24);
        Instantiate(prefab, new Vector3(x, 0, obstacleSpawnZ), Quaternion.Euler(0, 180, 0));
    }
}